"use client"

import { useEffect, useRef } from "react"
import { handleSsoCallback } from "@/features/auth/login/server/callback"

export function SsoCallbackHandler({ code, state }: { code: string; state: string }) {
    const formRef = useRef<HTMLFormElement>(null)
    const submittedRef = useRef(false)

    useEffect(() => {
        if (submittedRef.current) return
        submittedRef.current = true
        formRef.current?.requestSubmit()
    }, [])

    return (
        <form ref={formRef} action={handleSsoCallback} className="hidden">
            <input type="hidden" name="code" value={code} />
            <input type="hidden" name="state" value={state} />
        </form>
    )
}
