// app/competition/[id]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background font-poppins">
      <Navbar notTransparent />
      
      <main className="flex flex-col items-center justify-center flex-1 px-4 pt-32 pb-16">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-juneBud mb-4">Competition Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            {"The competition you're looking for doesn't exist or might have been removed."}
          </p>
          <Link href="/competition">
            <Button className="bg-juneBud hover:bg-juneBud/90 text-white">
              Back to Competitions
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}