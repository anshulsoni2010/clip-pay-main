import { SignUpForm } from "../form"
import { Suspense } from "react"
export default function CreatorSignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm userType="creator" />
    </Suspense>
  )
}
