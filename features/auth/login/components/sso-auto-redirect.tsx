"use client"

import { useEffect, useRef } from "react"
import { loginWithSso } from "@/features/auth/login/server/login"

export function SsoAutoRedirect() {
    const formRef = useRef<HTMLFormElement>(null)
    const submittedRef = useRef(false)

    useEffect(() => {
        if (submittedRef.current) return
        submittedRef.current = true
        formRef.current?.requestSubmit()
    }, [])

    return <form ref={formRef} action={loginWithSso} className="hidden" />
}
