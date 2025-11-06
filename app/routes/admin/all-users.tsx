import { Header } from "components"
import {ColumnsDirective, GridComponent} from "@syncfusion/ej2-react-grids"
import { ColumnDirective } from "@syncfusion/ej2-react-charts"
import { cn, formatDate } from "~/lib/utils"
import { getAllUsers } from "~/appwrite/auth"
import type { Route } from "./+types/all-users"


export async function loader (){
  const {users, total} = await getAllUsers(10, 0)
  
  return {users, total}
}

const AllUsers = ({loaderData} : Route.ComponentProps) => {
  const {users} = loaderData;
  console.log(users)

  return (
    <main className="all-users wrapper">
      <Header 
        title="Manage Users"
        description="Filter, sort, & access detailed user profiles"
      />

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: UserData)=>(
              <div className="flex items-center gap-1.5 px-4">
                  <img src={props.imageUrl} alt="user" className="rounded-full size-8 aspect-square" referrerPolicy="no-referrer"/>
                  <p>{props.name}</p>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="$createdAt"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
            template={({$createdAt} : {$createdAt : string}) => formatDate($createdAt)}
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={({status}: UserData) => (
              <article className={cn(
                'status-column', status === 'user'? 'bg-success-50': 'bg-light-300'
              )}>
                <div className={cn('size-1.5 rounded-full', status === 'user'? 'bg-success-500' : "bg-gray-500")}>
                </div>
                  <h3 className={cn('font-inter text-xs font-medium', status === 'user' ? 'text-success-700' : 'text-gray-500')}>{status}</h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  )
}
export default AllUsers