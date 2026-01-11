import { useState, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { User as UserIcon, EnvelopeSimple, Buildings, Camera, Check, X, Upload } from '@phosphor-icons/react'
import { User } from '@/lib/types'

interface UserProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfile({ open, onOpenChange }: UserProfileProps) {
  const { currentUser, setCurrentUser, users, setUsers } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(currentUser)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      if (editedUser) {
        setEditedUser({ ...editedUser, avatarUrl: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    if (editedUser) {
      setEditedUser({ ...editedUser, avatarUrl: undefined })
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!editedUser || !currentUser) return

    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setCurrentUser(editedUser)
      
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(u => u.id === editedUser.id)
        if (userIndex >= 0) {
          const newUsers = [...prevUsers]
          newUsers[userIndex] = editedUser
          return newUsers
        }
        return prevUsers
      })

      toast.success('Profile updated successfully')
      setIsEditing(false)
      setAvatarPreview(null)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedUser(currentUser)
    setAvatarPreview(null)
    setIsEditing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'xebia-admin':
        return 'default'
      case 'approver':
        return 'secondary'
      case 'client':
        return 'outline'
      default:
        return 'outline'
    }
  }

  if (!currentUser || !editedUser) return null

  const displayAvatar = avatarPreview || editedUser.avatarUrl
  const displayInitials = getInitials(editedUser.name)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon size={24} className="text-primary" />
            User Profile
          </DialogTitle>
          <DialogDescription>
            View and manage your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={displayAvatar} alt={editedUser.name} />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={20} className="text-white" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  Upload Photo
                </Button>
                {displayAvatar && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <X size={16} />
                    Remove
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            <div className="text-center">
              <Badge variant={getRoleBadgeVariant(editedUser.role)} className="capitalize">
                {editedUser.role.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserIcon size={16} />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md font-medium">
                  {editedUser.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <EnvelopeSimple size={16} />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="px-3 py-2 bg-muted/50 rounded-md">
                  {editedUser.email}
                </div>
              )}
            </div>

            {editedUser.role === 'client' && (
              <div className="space-y-2">
                <Label htmlFor="organization" className="flex items-center gap-2">
                  <Buildings size={16} />
                  Organization
                </Label>
                {isEditing ? (
                  <Input
                    id="organization"
                    value={editedUser.organization || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, organization: e.target.value })}
                    placeholder="Enter your organization"
                  />
                ) : (
                  <div className="px-3 py-2 bg-muted/50 rounded-md">
                    {editedUser.organization || 'Not specified'}
                  </div>
                )}
              </div>
            )}

            <Card className="bg-muted/30 border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono font-medium">{editedUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-medium capitalize">{editedUser.role.replace('-', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                <Check size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <UserIcon size={16} />
                Edit Profile
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
