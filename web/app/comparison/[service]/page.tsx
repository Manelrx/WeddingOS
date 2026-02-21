import VendorSelectionClient from "./VendorSelectionClient";

export default async function ComparisonPage(props: { params: Promise<{ service: string }> }) {
    const { service } = await props.params;

    return <VendorSelectionClient service={service} />;
}
