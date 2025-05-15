import Image from "next/image"

export function ThemeImage() {
  return (
    <div>
      <Image
        src="/images/logo-light.svg"
        alt="Logo"
        width={100}
        height={100}
        className="block dark:hidden object-contain"
      />
      <Image
        src="/images/logo-dark.svg"
        alt="Logo"
        width={100}
        height={100}
        className="hidden dark:block object-contain"
      />
    </div>
  )
}
