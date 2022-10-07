import BasicDateTimePicker from "../../components/DateTimepicker";
import SidebarLayout from "../SidebarLayout";
import CreateCategory from "./components/CreateCategory";
import CreateExpense from "./components/CreateExpense";

const Expenses = () => {
  return (
    <SidebarLayout>
      <div>Expenses</div>
      <CreateCategory />
      <CreateExpense />
    </SidebarLayout>
  );
};

export default Expenses;
