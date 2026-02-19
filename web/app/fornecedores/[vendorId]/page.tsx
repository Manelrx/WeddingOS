
import React from 'react';
import { getVendorById } from '@/lib/api/vendors.api';
import { notFound } from 'next/navigation';
import { VendorDetailClient } from '@/components/vendors/VendorDetailClient';

export default async function VendorPage({ params }: { params: Promise<{ vendorId: string }> }) {
    const { vendorId } = await params;

    let vendor;
    try {
        vendor = await getVendorById(vendorId);
    } catch (error) {
        console.error("Error fetching vendor:", error);
    }

    if (!vendor) {
        notFound();
    }

    return <VendorDetailClient vendor={vendor} />;
}
