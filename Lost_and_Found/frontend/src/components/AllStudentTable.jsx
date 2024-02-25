import React from "react";
import axios from "axios";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function AllStudentTable(student) {
  const [open, setOpen] = useState(false); // For set dialoge Box
  const [deleteUser, setDeleteUser] = useState(false); // For set delete user which one is clicked

  // When user click on updatestatus
  const handleClickOpen = () => {
    setOpen(true);
  };

  // When user click on No in dialoge Box
  const handleClose = () => {
    setOpen(false);
  };

  const HandleDelete = async (event, user) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8000/student/delete", {
        email: user.email,
      })
      .then((res) => {
        window.location.reload("user/admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("user/admin/dashboard");
      });
  };

  return (
    <tbody className="text-black-600 text-sm font-light">
      <tr className="border-b border-slate-300 hover:bg-gray-100">
        <td className="py-3 px-6 text-center">
          <span className="font-medium">{student.student.userName}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div className="font-normal">{student.student.email}</div>
        </td>
        <td className="py-3 px-6 text-center" style={{ cursor: "pointer" }}>
          <div
            className="transform hover:text-red-500 hover:scale-110 font-normal"
            onClick={() => {
              setDeleteUser(student.student);
              handleClickOpen();
            }}
          >
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" style={{ color: "red" }}>
                {`Are you sure want to Delete User : ${deleteUser.userName}?`}
              </DialogTitle>
              <DialogContent>
                {/* <DialogContentText id="alert-dialog-description">
                                      Let Google help apps determine location.
                                      This means sending anonymous location data
                                      to Google, even when no apps are running.
                                    </DialogContentText> */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>
                  <p
                    onClick={() => {
                      HandleDelete(deleteUser);
                    }}
                  >
                    Yes
                  </p>
                </Button>
                <Button onClick={handleClose} autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            <RiDeleteBin6Line className="table-icons"></RiDeleteBin6Line>
            Delete
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AllStudentTable;
