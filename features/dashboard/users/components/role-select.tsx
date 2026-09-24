"use client"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { userRoleLabels, userRoles } from "../schemas/user"

export default function RoleSelect({
    defaultValue,
    errors,
}: {
    defaultValue?: string
    errors?: string[]
}) {
    const errorMessage = errors?.[0]

    return (
        <div>
            <Label htmlFor="role" className="mb-2 block text-sm font-medium">
                Role <span className="text-red-500">*</span>
            </Label>
            <Select name="role" defaultValue={defaultValue ?? "user"} required>
                <SelectTrigger
                    id="role"
                    className="w-full"
                    aria-invalid={errorMessage ? "true" : "false"}
                >
                    <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                    {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                            {userRoleLabels[role]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errorMessage && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
