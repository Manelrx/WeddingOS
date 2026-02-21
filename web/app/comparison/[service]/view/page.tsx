import ComparisonClient from "../ClientComparison";

export default async function ComparisonViewPage(props: { params: Promise<{ service: string }> }) {
    const { service } = await props.params;

    return <ComparisonClient service={service} />;
}
