import { TableSkeleton } from "@/components/panel/tables/TableSkeleton";

export default function SeriesLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <TableSkeleton />
        </div>
    );
}
