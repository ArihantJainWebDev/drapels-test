'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { FaGithub } from 'react-icons/fa';

export default function GithubSignIn() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGithubSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Handle redirect if exists
      const redirect = sessionStorage.getItem('post_login_redirect');
      router.push(redirect || '/');
      
    } catch (error: any) {
      toast({
        title: 'GitHub Sign-In Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full gap-2"
      onClick={handleGithubSignIn}
    >
      <FaGithub className="text-gray-900" />
      Continue with GitHub
    </Button>
  );
}
