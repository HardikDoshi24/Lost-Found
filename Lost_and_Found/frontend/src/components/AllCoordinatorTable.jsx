import React from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

function AllCoordinatorTable(coordinator) {
  const HandleDelete = async (event) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8000/coordinator/delete", {
        email: coordinator.coordinator.email,
      })
      .then((res) => {
        window.location.reload("user/admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("user/admin/dashboard");
      });
  };

  return (
    <tbody className="text-Neutral-900 text-sm font-light">
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 text-center">
          <span className="font-medium">
            {coordinator.coordinator.userName}
          </span>
        </td>
        <td className="py-3 px-6 text-center">
          <span className="font-normal">{coordinator.coordinator.email}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div className="font-normal">
            {coordinator.coordinator.department}
          </div>
        </td>
        <td className="py-3 px-6 text-center" style={{ cursor: "pointer" }}>
          <div
            className="transform hover:text-red-500 hover:scale-110 font-normal"
            onClick={HandleDelete}
          >
            <RiDeleteBin6Line className="table-icons"></RiDeleteBin6Line>
            Delete
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AllCoordinatorTable;
