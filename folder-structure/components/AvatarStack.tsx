import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarStackProps {
  users: Array<{ id: string; name: string; avatar: string }>
  limit?: number
}

export function AvatarStack({ users, limit = 3 }: AvatarStackProps) {
  const visibleUsers = users.slice(0, limit)
  const remainingCount = Math.max(0, users.length - limit)

  return (
    <div className="flex items-center">
      <div className="flex -space-x-4">
        {visibleUsers.map((user) => (
          <Avatar key={user.id} className="border-2 border-background relative inline-block h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="relative inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-600 border-2 border-background rounded-full">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}
