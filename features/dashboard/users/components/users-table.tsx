"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TableListLayout from "@/components/shared/zecode/table/layouts/list/table-list-layout"
import { deleteUser } from "../server/delete-user"
import { UserData } from "../server/get-users"
import { userRoleLabels } from "../schemas/user"

type Props = {
    items: UserData[]
    currentUserId: string
}

export default function UsersTable({ items, currentUserId }: Props) {
    const router = useRouter()

    const handleDelete = async (user: UserData) => {
        const result = await deleteUser(user.id)

        if (result.success) {
            toast.success(result.message || "User berhasil dihapus")
            router.refresh()
        } else {
            toast.error(result.message || "Gagal menghapus user")
        }

        return result
    }

    return (
        <TableListLayout<UserData>
            data={items}
            rowKey={(user) => user.id}
            columns={[
                {
                    type: "custom-column",
                    key: "name",
                    label: "Nama",
                    render: (user) =>
                        user.id === currentUserId ? `${user.name || "-"} (Anda)` : user.name || "-",
                },
                { type: "text-column", key: "email", label: "Email" },
                {
                    type: "custom-column",
                    key: "id",
                    label: "SSO User ID",
                    render: (user) => <span className="font-mono text-xs">{user.id}</span>,
                },
                {
                    type: "custom-column",
                    key: "role",
                    label: "Role",
                    render: (user) => userRoleLabels[user.role] ?? user.role,
                },
                {
                    type: "action-column",
                    key: "actions",
                    label: "",
                    actions: (user) =>
                        user.id === currentUserId
                            ? []
                            : [
                                  {
                                      type: "edit",
                                      href: () => `/dashboard/users/${user.id}/edit`,
                                      label: "Ubah",
                                  },
                                  {
                                      type: "delete",
                                      dialogTitle: `Hapus user "${user.name || user.id}"?`,
                                      dialogDescription:
                                          "Aksi tidak bisa dibatalkan setelah dilakukan",
                                      method: () => handleDelete(user),
                                      label: "Hapus",
                                  },
                              ],
                },
            ]}
        />
    )
}
