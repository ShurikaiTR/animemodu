import type { AniListEdge } from "@/shared/types/helpers";

const ANILIST_API_URL = "https://graphql.anilist.co";

export interface AniListCharacter {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
    medium: string;
  };
  role: "MAIN" | "SUPPORTING" | "BACKGROUND";
}

interface AniListSearchResult {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large: string;
  };
}

export async function searchAniList(query: string): Promise<AniListSearchResult[]> {
  const queryGraphql = `
    query ($search: String) {
      Page(page: 1, perPage: 5) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
        }
      }
    }
    `;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: queryGraphql,
        variables: { search: query },
      }),
    });

    const data = await response.json();

    if (!data?.data?.Page?.media) {
      return [];
    }

    return data.data.Page.media;
  } catch {
    return [];
  }
}

export async function getAnimeCharacters(anilistId: number): Promise<AniListCharacter[]> {
  const queryGraphql = `
    query ($id: Int) {
      Media(id: $id) {
        characters(sort: [ROLE, RELEVANCE]) {
          edges {
            role
            node {
              id
              name {
                full
                native
              }
              image {
                large
                medium
              }
            }
          }
        }
      }
    }
    `;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: queryGraphql,
        variables: { id: anilistId },
      }),
    });

    const data = await response.json();

    if (!data?.data?.Media?.characters?.edges) {
      return [];
    }

    const edges = data.data.Media.characters.edges as AniListEdge[];

    return edges
      .filter((edge): edge is AniListEdge & { node: NonNullable<AniListEdge["node"]> } =>
        edge.node !== undefined &&
        edge.node.id !== undefined &&
        edge.node.name !== undefined &&
        edge.node.image !== undefined
      )
      .map((edge) => ({
        id: edge.node.id!,
        name: {
          full: edge.node.name?.full || "",
          native: edge.node.name?.native || "",
        },
        image: {
          large: edge.node.image?.large || "",
          medium: edge.node.image?.medium || "",
        },
        role: (edge.role || "BACKGROUND") as "MAIN" | "SUPPORTING" | "BACKGROUND",
      }));
  } catch {
    return [];
  }
}
