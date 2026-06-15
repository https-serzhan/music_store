import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { SongDetails } from './SongDetails';
import type { Song, SongsResponse } from '../types/song';

type TableViewProps = {
  data?: SongsResponse;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  page: number;
  playbackKey: string;
  onPageChange: (page: number) => void;
};

export function TableView({ data, isLoading, isFetching, error, page, playbackKey, onPageChange }: TableViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const songs = data?.songs ?? [];
  const columns = useMemo<ColumnDef<Song>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'index',
        cell: (info) => <span className="indexCell">{info.getValue<number>()}</span>,
      },
      {
        header: 'Song title',
        accessorKey: 'title',
      },
      {
        header: 'Artist',
        accessorKey: 'artist',
      },
      {
        header: 'Album',
        accessorKey: 'album',
      },
      {
        header: 'Genre',
        accessorKey: 'genre',
      },
      {
        header: 'Likes',
        accessorKey: 'likes',
        cell: (info) => <span className="likesPill">{info.getValue<number>()}</span>,
      },
    ],
    [],
  );
  const table = useReactTable({
    data: songs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  useEffect(() => {
    setExpandedIndex(null);
  }, [data?.locale, data?.seed, data?.likesAverage, page]);

  if (isLoading && songs.length === 0) {
    return <div className="statePanel">Loading songs...</div>;
  }

  if (error) {
    return <div className="statePanel errorPanel">{error.message}</div>;
  }

  return (
    <section className="tableShell">
      <div className="tableStatus">
        <span>Page {page}</span>
        {isFetching ? <span className="fetchingText">Refreshing</span> : null}
      </div>
      <div className="tableWrap">
        <table className="songsTable">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const song = row.original;
              const expanded = expandedIndex === song.index;

              return (
                <Fragment key={row.id}>
                  <tr
                    className={expanded ? 'songRow expandedSongRow' : 'songRow'}
                    onClick={() => setExpandedIndex(expanded ? null : song.index)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                  {expanded ? (
                    <tr className="detailsRow">
                      <td colSpan={columns.length}>
                        <SongDetails song={song} playbackKey={playbackKey} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="paginationBar">
        <button className="button secondaryButton" type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button className="button primaryButton" type="button" onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </section>
  );
}
