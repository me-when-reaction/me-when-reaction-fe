'use client'

import React from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { HTTPRequestClient } from '@/apis/api-client';
import { GetTagManagementResponse } from '@/models/response/tag';
import { Table } from 'flowbite-react';
import { PaginationResponse } from '@/models/response/base';
import { API_DETAIL } from '@/configuration/api';
import HTTPMethod from 'http-method-enum';

interface TagColumn {
  name: string,
  alias: string[],
}
const columnHelper = createColumnHelper<TagColumn>();
const columns = [
  columnHelper.display({
    header: 'No.',
    cell: (d) => d.row.index + 1
  }),
  columnHelper.accessor<'name', string>('name', {
    header: 'Tag',
    cell: x => {
      console.log(x.cell.getValue());
      return x.cell.getValue();
    },
  }),
  columnHelper.accessor<'alias', string[]>('alias', {
    header: 'Alias',
    cell: x => x.getValue().join(", ")
  })
]

export default function TagClientPage() {
  const { data: queryData } = useQuery({
    queryKey: ["a"],
    queryFn: async() => {
      let resp = await HTTPRequestClient<PaginationResponse<GetTagManagementResponse[]>, never>({
        method: HTTPMethod.GET,
        url: API_DETAIL.TAG.route
      })

      let x = resp.data.data.map(x => ({
        name: x.name,
        alias: x.alias
      })) as TagColumn[];
      return x;
    }
  });

  const table = useReactTable<TagColumn>({
    columns: columns,
    data: queryData ?? [],
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className='w-full h-full flex justify-center items-center bg-slate-700 flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Manage Tags</h1>
      <Table>
        <Table.Head>
          {
            table.getHeaderGroups()[0].headers.map(header => (
              <Table.HeadCell key={header.id}>
                { header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }
              </Table.HeadCell>
            ))
          }
        </Table.Head>
        <Table.Body>
          {
            table.getRowModel().rows.map(row => (
              <Table.Row key={row.id} className='dark:border-gray-700 dark:bg-gray-800'>
                {
                  row.getVisibleCells().map(cell => (
                    <Table.Cell key={cell.id} className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))
                }
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  )
}
