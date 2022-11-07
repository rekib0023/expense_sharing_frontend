import SidebarLayout from "./SidebarLayout";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { groupFields } from "../constants/formFields";
import MultiSelect from "../components/MultiSelect";
import ModalForm from "../components/ModalForm";

const efields = groupFields;
let efieldsState = {};
efields.forEach((field) => (efieldsState[field.id] = ""));

const Groups = () => {
  const axiosPrivate = useAxiosPrivate();

  const [showGroupModal, setShowGroupModal] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  efields[0]["fieldAttribs"] = {
    value: groupName,
    handleChange: (e) => setGroupName(e.target.value),
  };

  efields[1]["fieldAttribs"] = {
    value: groupDesc,
    handleChange: (e) => setGroupDesc(e.target.value),
  };

  efields[2]["fieldAttribs"] = {
    value: groupUsers,
    inputType: "multi-select",
    dropdownList: ["1", "2", "3"],
    handleChange: (e) =>
      setGroupUsers(
        typeof e.target.value === "string"
          ? e.target.value.split(",")
          : e.target.value
      ),
  };

  const handleGroupSubmit = async (e) => {};

  return (
    <SidebarLayout>
      <>
        <button
          className="bg-blue-900 text-white hover:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowGroupModal(true)}
        >
          Open Group modal
        </button>
        {showGroupModal && !isLoading ? (
          <ModalForm
            title="Create Group"
            onClick={() => setShowGroupModal(false)}
            fields={efields}
            handleSubmit={handleGroupSubmit}
          />
        ) : null}
      </>
      {/* <MultiSelect
        value={personName}
        handleChange={handleChange}
        valueMaps={names}
        label="Tags"
      /> */}
    </SidebarLayout>
  );
};

export default Groups;
