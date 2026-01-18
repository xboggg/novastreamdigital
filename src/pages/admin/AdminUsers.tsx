import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, User, Mail, Calendar } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const { toast } = useToast();

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setProfiles(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = searchQuery === '' ||
        profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.user_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || profile.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [profiles, searchQuery, roleFilter]);

  const toggleRole = async (profile: Profile) => {
    const newRole = profile.role === 'admin' ? 'user' : 'admin';

    // Prevent removing the last admin
    if (newRole === 'user') {
      const adminCount = profiles.filter(p => p.role === 'admin').length;
      if (adminCount <= 1) {
        toast({
          variant: 'destructive',
          title: 'Cannot remove admin',
          description: 'At least one admin must remain in the system.'
        });
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profile.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`
      });
      fetchProfiles();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const userCount = profiles.filter(p => p.role === 'user').length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profiles.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminCount}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userCount}</p>
              <p className="text-sm text-muted-foreground">Regular Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary transition-colors"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {profiles.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="text-muted-foreground mb-4">No users match your search</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-2">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="card-premium p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                profile.role === 'admin' ? 'bg-emerald-500/10' : 'bg-secondary'
              }`}>
                {profile.role === 'admin' ? (
                  <Shield className="w-5 h-5 text-emerald-500" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium truncate">{profile.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {formatDate(profile.created_at)}
                  </span>
                  <span className="truncate text-xs opacity-60">
                    ID: {profile.user_id.slice(0, 8)}...
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                profile.role === 'admin'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {profile.role}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRole(profile)}
                className="gap-2"
              >
                {profile.role === 'admin' ? (
                  <>
                    <ShieldOff className="w-4 h-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Make Admin
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10"
      >
        <h3 className="font-medium mb-2">About User Roles</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Admin:</strong> Full access to all admin features including content management, leads, and user management.</li>
          <li><strong>User:</strong> Basic access, can view public content only.</li>
        </ul>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminUsers;
