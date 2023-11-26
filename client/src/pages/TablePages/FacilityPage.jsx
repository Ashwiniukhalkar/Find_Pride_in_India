

import React, { useState, useEffect } from "react";
import CustomTable from "../../components/Table/Table";
import { addFacility, fetchFacility } from "../../services/domCRUD";
import { AddButton, UpdateButton, UpdateDeletebuttons } from "../../components/CustomButtons";
import { FormFacility } from '../../components/Forms/ManagementsForms';
import { Modal } from 'antd';
import { Toaster, toast } from 'react-hot-toast'

import { styled } from 'styled-components';
const StyledImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export const FacilityTable = () => {

  const columns = [
    {
      name: 'Image',
      selector: (row) => <StyledImage src={row.path} alt="Product" />,
      sortable: true,
      maxWidth: '110px', // Adjust the maximum width as needed
      textAlign: 'center',
    },
    {
      name: "Facility Name",
      selector: (row) => row.facility_name,
      sortable: true,
      textAlign: 'center',
    },
    {
      name: "Facility Number",
      selector: (row) => row.facility_number,
      sortable: true,
    },
    {
      name: "Event Location",
      selector: (row) => row.facility_location,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <UpdateDeletebuttons form_type={` facility ${row.facility_name} `} onClick={() => modalOpenClose('update', row)} />
      ),
    },
  ];



  const [selectedFile, setSelectedFile] = useState(null);
  const storedUserJSON = localStorage.getItem("user");
  const user = JSON.parse(storedUserJSON);

  const initialData =  {
    facility_name:   "",
    facility_number:"",
    facility_location:  "",
    state: user.state,
    city: user.city,
    dest_name: user.destinationName,
    dest_id: user._id,
  }

  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const modalOpenClose = (formType, rowData) => {
    setVisible(true);
    setFormData(rowData);
    setIsUpdateMode(formType === 'update');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      // Handle update logic
      // ...
    } else {
      if (selectedFile) {
        try {
          const FacilityData = {
            ...FormData,
            image: selectedFile,
          };
          const response = await addFacility(FacilityData);
          if (response.status === 200) {
            toast.success("Facility added Successfully");
          }
          else {
            toast.error("Failed to add Facility ");
          }
        } catch (error) {
          console.error("Firebase Storage Error:", error);
        }
      } else {
        console.error("No file selected");
      }
    }
  };

  const getFacility = async () => {
    try {
      const storedUserJSON = localStorage.getItem("user");
      const storedUser = JSON.parse(storedUserJSON);

      const res = await fetchFacility(storedUser.destinationName);
      const data = res.data.data;

      setRecords(data);
      setFilterRecords(data);
    } catch (error) {
      console.error("Error fetching checkpoints:", error);
    }
  };

  useEffect(() => {
    getFacility();
  }, []);

  const onChangeHandler = (e) => {
    // setData({ ...data, [e.target.name]: e.target.value });
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <>
      <Toaster position="top-center" />
      <Modal
        onCancel={() => setVisible(false)}
        footer={null}
        visible={visible}
      >
        <form onSubmit={onSubmitHandler}>
          <FormFacility
            selectedFile={selectedFile}
            handleFileChange={handleFileChange}
            onChangeHandler={onChangeHandler}
            data={formData}
            isUpdateMode={isUpdateMode}
          />
          {isUpdateMode ? (
            <UpdateButton title={"Facility"} />
          ) : (
            <AddButton form_type={"Facility"} />
          )}
        </form>
      </Modal>
      <CustomTable
      handleFileChange={handleFileChange}
      onChangeHandler={onChangeHandler}
      setFormData={setFormData}
      data={formData}
      selectedFile={selectedFile}
      initialData={initialData}
        columns={columns}
        addform={<FormFacility/>}
        title={'Facility'}
        searchfield={'facility_name'}
        records={records}
        setRecords={setRecords}
        filterRecords={filterRecords}
        setFilterRecords={setFilterRecords}
        fetchData={getFacility}
        modalOpenClose={modalOpenClose}
      />
    </>
  );
};