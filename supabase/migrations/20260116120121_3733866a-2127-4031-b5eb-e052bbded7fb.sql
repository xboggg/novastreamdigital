-- Drop the existing UPDATE policy that allows full profile updates
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new UPDATE policy that only allows updating non-sensitive fields (excluding role)
CREATE POLICY "Users can update own profile safely" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Create a separate policy for admins to update any profile including roles
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_admin());