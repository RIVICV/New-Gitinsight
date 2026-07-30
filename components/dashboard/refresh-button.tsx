// components/shared/refresh-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function RefreshButton() {
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await queryClient.invalidateQueries()
    setIsRefreshing(false)
  }

  return (
    <Button 
      onClick={handleRefresh} 
      size="sm" 
      variant="outline"
      disabled={isRefreshing}
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  )
}