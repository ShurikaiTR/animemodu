"use client";

import type { Database } from "@/shared/types/supabase";
import { SeriesTableRowContent } from "./SeriesTableRowContent";
import { SeriesTableRowRating, SeriesTableRowStatus } from "./SeriesTableRowCells";
import { SeriesTableRowActions } from "./SeriesTableRowActions";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface SeriesTableRowProps {
    item: AnimeRow;
    onEdit: (item: AnimeRow) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (item: AnimeRow) => void;
    onUpdateEpisodes?: (id: string) => void;
    isUpdatingEpisodes?: boolean;
}

export function SeriesTableRow({
    item,
    onEdit,
    onDelete,
    onToggleFeatured,
    onUpdateEpisodes,
    isUpdatingEpisodes
}: SeriesTableRowProps) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            {/* Poster & Title */}
            <td className="p-4 align-middle">
                <SeriesTableRowContent item={item} />
            </td>

            {/* Rating & Year */}
            <td className="p-4 align-middle">
                <SeriesTableRowRating item={item} />
            </td>

            {/* Status / Featured */}
            <td className="p-4 align-middle">
                <SeriesTableRowStatus item={item} />
            </td>

            {/* Actions */}
            <td className="p-4 align-middle text-right">
                <SeriesTableRowActions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFeatured={onToggleFeatured}
                    onUpdateEpisodes={onUpdateEpisodes}
                    isUpdatingEpisodes={isUpdatingEpisodes}
                />
            </td>
        </tr>
    );
}
