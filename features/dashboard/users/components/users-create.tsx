"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BasicFormLayout from "@/components/shared/zecode/form/layouts/basic"
import { createUser } from "../server/create-user"
import RoleSelect from "./role-select"

export default function UsersCreate() {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(createUser, undefined)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message || "User berhasil didaftarkan!")
            setTimeout(() => router.push("/dashboard/users"), 500)
        } else if (state?.errors?.general) {
            toast.error(state.errors.general[0])
        }
    }, [state?.success, state?.errors?.general, state?.message, router])

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <Card className="flex w-full flex-col gap-5 p-5">
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
                            type: "text-input",
                            name: "password",
                            label: "Password",
                            inputType: "password",
                            autoComplete: "new-password",
                            required: false,
                            errors: state?.errors?.password,
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
