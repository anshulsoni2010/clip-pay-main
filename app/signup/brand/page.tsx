import { Suspense } from "react"
import { SignUpForm } from "../form"

export default function BrandSignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm userType="brand" />
    </Suspense>
  )
}
