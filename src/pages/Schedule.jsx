import QuickActions from "../components/dashboard/QuickActions";
import WorkHoursForm from "../components/WorkHoursForm";

export default function Schedule({ session }) {
    if (!session?.user) return;
    return (
        <div>
            <h1>Work Schedule</h1>
            {/* <QuickActions/> */}
            <WorkHoursForm session={session}/>
        </div>
    )
}