import { MasonryGrid, type MasonryCardData } from '@/components/ui/masonry-grid-with-scroll-animation';

// Sample data for the demo
const demoItems: MasonryCardData[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    alt: 'CCTV Surveillance Camera System',
    content: 'Hikvision & CP Plus HD dome and bullet cameras.',
    linkHref: '#services',
    linkText: 'Learn More',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    alt: 'Inverter & UPS Power Systems',
    content: 'Luminous, Exide & Microtek inverter and UPS units.',
    linkHref: '#services',
    linkText: 'View Details',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    alt: 'Tubular Battery Power Backup',
    content: 'Exide Invatubular & Powerex long-life backup batteries.',
    linkHref: '#services',
    linkText: 'Explore',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Security & Access Control',
    content: 'Video door phones and security surveillance systems.',
    linkHref: '#services',
    linkText: 'Get Quote',
  },
];

/**
 * A demo component to showcase the MasonryGrid.
 * @returns {JSX.Element} The rendered demo.
 */
export default function MasonryGridDemo() {
  return (
    <div className="bg-background min-h-[120vh] py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Animated Masonry Grid</h1>
        <p className="text-muted-foreground mt-2">Scroll down to see the items animate into view.</p>
      </div>
      <MasonryGrid items={demoItems} />
    </div>
  );
}
