"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import BasicFormLayout from "@/components/shared/zecode/form/layouts/basic"
import { editUser } from "../server/edit-user"
import RoleSelect from "./role-select"
import { UserData } from "../server/get-users"

type Props = {
    id: string
    user: UserData
}

export default function UsersEdit({ id, user }: Props) {
    const router = useRouter()
    const editUserWithId = editUser.bind(null, id)
    const [state, formAction, isPending] = useActionState(editUserWithId, {
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    })

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message || "User berhasil diperbarui!")
            setTimeout(() => router.push("/dashboard/users"), 500)
        } else if (state?.errors?.general) {
            toast.error(state.errors.general[0])
        }
    }, [state?.success, state?.errors?.general, state?.message, router])

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <Card className="flex w-full flex-col gap-5 p-5">
                <div className="flex flex-col gap-2">
                    <Label>SSO User ID</Label>
                    <span className="rounded-4xl border border-input bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                        {user.id}
                    </span>
                </div>

                <BasicFormLayout
                    grid={1}
                    fields={[
                        {
                            type: "text-input",
                            name: "name",
                            label: "Nama",
                            defaultValue: state?.data?.name ?? "",
                            errors: state?.errors?.name,
                        },
                        {
                            type: "text-input",
                            name: "email",
                            label: "Email",
                            inputType: "email",
                            defaultValue: state?.data?.email ?? "",
                            errors: state?.errors?.email,
                        },
                        {
                            type: "custom-field",
                            name: "role",
                            render: () => (
                                <RoleSelect
                                    defaultValue={state?.data?.role}
                                    errors={state?.errors?.role}
                                />
                            ),
                        },
                    ]}
                />
            </Card>
            <div className="flex w-full gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="text-destructive"
                    asChild
                    disabled={isPending}
                >
                    <Link href="/dashboard/users">Batal</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </form>
    )
}
