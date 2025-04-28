import { NextResponse } from 'next/server';
import { Service } from '@/types/service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';

  try {
    // Fetch all services from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    const allServices: Service[] = await response.json();

    // Filter services based on search query and location
    const filteredServices = allServices.filter(service => {
      const matchesQuery = query
        ? service.title.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase()) ||
          service.category.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesLocation = location
        ? service.location.toLowerCase() === location.toLowerCase()
        : true;

      return matchesQuery && matchesLocation;
    });

    return NextResponse.json(filteredServices);
  } catch (error) {
    console.error('Error searching services:', error);
    return NextResponse.json(
      { error: 'Failed to search services' },
      { status: 500 }
    );
  }
} 
