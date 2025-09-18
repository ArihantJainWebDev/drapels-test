'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';

export default function GoogleSignIn() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Handle redirect if exists
      const redirect = sessionStorage.getItem('post_login_redirect');
      router.push(redirect || '/');
      
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full gap-2"
      onClick={handleGoogleSignIn}
    >
      <FaGoogle className="text-red-500" />
      Continue with Google
    </Button>
  );
}
