import { Header, StatCard, TripCard } from "components"
import { getAllUsers, getUser } from "~/appwrite/auth";

import { getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats } from "~/appwrite/dashboard";
import type { Route } from "./+types/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { Category, ChartComponent, ColumnSeries, DataLabel, Inject, SeriesCollectionDirective, SeriesDirective, SplineAreaSeries, Tooltip } from "@syncfusion/ej2-react-charts";
import { userXAxis, useryAxis } from "~/constants";


export const clientLoader = async () => {
  const [
    user, 
    dashboardStat, 
    trips, 
    userGrowth, 
    tripsByTravelStyle, 
    allUsers] = await Promise.all([
    await getUser(),
    await getUsersAndTripsStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(4, 0)
  ])

  const allTrips = trips.allTrips.map(({$id, tripDetails, imageUrls}) => ({
    id: $id,
    ...parseTripData(tripDetails),
    imageUrls: imageUrls ?? []
  }))

  const mapperUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount,
  }))

  return {
    user, 
    dashboardStat, 
    allTrips, 
    userGrowth, 
    tripsByTravelStyle, 
    allUsers: mapperUsers
  }
}


const Dashboard = ({loaderData} : Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const {dashboardStat, allTrips, userGrowth, tripsByTravelStyle, allUsers} = loaderData
  
  return (
    <main className="dashboard wrapper">
      <Header 
        title={`Welcome ${user?.name ?? 'Guest'} 👋`}
        description="Track activity, trends and popular destination in real time."
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-col-1 md:grid-cols-3 gap-6 w-full">
          <StatCard
            headerTitle="Total Users"
            total={dashboardStat.totalUsers}
            currentMonthCount={dashboardStat.usersJoined.currentMonth}
            lastMonthCount={dashboardStat.usersJoined.lastMonth}
          />
          <StatCard
            headerTitle="Total Trips"
            total={dashboardStat.totalTrips}
            currentMonthCount={dashboardStat.tripsCreated.currentMonth}
            lastMonthCount={dashboardStat.tripsCreated.lastMonth}
          />
          <StatCard
            headerTitle="Active Users Today"
            total={dashboardStat.userRole.total}
            currentMonthCount={dashboardStat.userRole.currentMonth}
            lastMonthCount={dashboardStat.userRole.lastMonth}
          />

        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>

        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard 
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name!}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests!, trip.travelStyle!]}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartComponent
              id="chart-1"
              primaryXAxis={userXAxis}
              primaryYAxis={useryAxis}
              title="User Growth"
              tooltip={{enable: true}}
            >
              <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]}/>

              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={userGrowth}
                  xName="day"
                  yName="count"
                  type="Column"
                  name="Column"
                  columnWidth={0.3}
                  cornerRadius={{topLeft: 10, topRight: 10}}
                />
              </SeriesCollectionDirective>
            </ChartComponent>
      </section>
    </main>
  )
}
export default Dashboard