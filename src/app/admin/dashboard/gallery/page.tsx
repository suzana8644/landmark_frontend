"use client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Organizer {
  organizerId: string;
  email: string;
  name: string;
  phoneNumber: string;
  whatsappId: string;
  themes: string[];
}

// @ts-ignore
const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };
  if (tableMeta?.editedRows[row.id]) {
    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
      />
    );
  }
  return <span>{value}</span>;
};

// @ts-ignore
const EditCell = ({ row, table }) => {
  const meta = table.options.meta;
  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    }
  };
  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="edit-cell">
          <button onClick={setEditedRows} name="cancel">
            X
          </button>
          <button onClick={setEditedRows} name="done">
            ✔
          </button>
        </div>
      ) : (
        <button onClick={setEditedRows} name="edit">
          ✐
        </button>
      )}
    </div>
  );
};
const columnHelper = createColumnHelper<Organizer>();
const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("name", {
    header: "Full Name",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.accessor("whatsappId", {
    header: "Whatsapp Number",
    cell: TableCell,
    meta: {
      type: "text",
    },
  }),
  columnHelper.display({
    id: "edit",
    cell: EditCell,
  }),
];
const Table = ({ fetchedData }: any) => {
  const [data, setData] = useState<Organizer[]>([]);
  const [originalData, setOriginalData] = useState<Organizer[]>([]);
  const [editedRows, setEditedRows] = useState({});
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch(`/api/fetchOrganizers`);
        if (!response.ok) {
          throw new Error("Failed to fetch event categories");
        }
        const data = await response.json();
        setData(data);
        setOriginalData(data);
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    };
    fetchOrganizers();
  }, [fetchedData]);

  const saveData = async () => {
    try {
      const updatedData = data;
      // Find the IDs of the organizers that have changed
      const changedOrganizerIDs = updatedData.reduce((acc, organizer) => {
        const originalOrganizer = originalData.find(
          (org) => org.organizerId === organizer.organizerId,
        );
        if (!originalOrganizer) {
          acc.push(organizer.organizerId); // If organizer is not found in original data, it's considered changed
        } else {
          // Check if any property values have changed
          const hasChanged = Object.keys(organizer).some((key) => {
            const originalValue = originalOrganizer[key as keyof Organizer];
            const updatedValue = organizer[key as keyof Organizer];

            // Check if property is an array and compare its elements
            if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
              if (originalValue.length !== updatedValue.length) {
                return true;
              }
              return originalValue.some(
                (element, index) => element !== updatedValue[index],
              );
            }

            // Check if property is an object and compare its keys and values
            if (
              typeof originalValue === "object" &&
              typeof updatedValue === "object"
            ) {
              const originalKeys = Object.keys(originalValue);
              const updatedKeys = Object.keys(updatedValue);
              if (originalKeys.length !== updatedKeys.length) {
                return true;
              }
              return originalKeys.some(
                (innerKey) =>
                  originalValue[innerKey as keyof typeof originalValue] !==
                  updatedValue[innerKey as keyof typeof updatedValue],
              );
            }

            // Compare primitive values
            return originalValue !== updatedValue;
          });

          if (hasChanged) {
            acc.push(organizer.organizerId);
          }
        }
        return acc;
      }, [] as string[]);
      console.log("Changed organizerIDs:", changedOrganizerIDs);
    } catch (error) {
      console.error("Error updating organizer data:", error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row,
            ),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row,
            ),
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });
  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => saveData()}>Save</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Table;
