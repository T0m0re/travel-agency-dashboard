import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns"
import { Header } from "components"
import type { Route } from "./+types/createTrips"

export const loader = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all')

    const data = await response.json()

    return  data
}

const CreateTrips = ({loaderData} : Route.ComponentProps) => {
    const countries = loaderData as Country[]
    console.log(countries)
    const handleSubmit = async () => {}
  return (
    <main className="flex fle-col gap-10 pb-20 wrapper">
        <Header title="Add a New Trip" description="View and edit AI Generated travel plans"/>

        <section className="mt-2 5 wrapper-md">
            <form className="trip-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="country">
                        Country
                    </label>
                    <ComboBoxComponent
                        id="country"
                        // dataSource={}
                    />
                </div>
            </form>
        </section>
    </main>
  )
}
export default CreateTrips