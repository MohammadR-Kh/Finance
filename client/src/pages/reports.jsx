import {useForm} from "react-hook-form"
import { useState, useEffect } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"


const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const schema = yup.object().shape({
    description: yup.string().required("Description is Required!"),
    title: yup.string().required("Title is Required!"),
  });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/reports');
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const {register, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(schema)});

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        setReports((prevReports => [...prevReports, result]))
        setIsFormVisible(false);
        console.log('Report added:', result);
      } else {
        console.error('Failed to add report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };
  const deleteReport = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setReports(reports.filter((report) => report._id !== id));
      } else {
        console.error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };



  const AddReport = ({onClose}) => {

    return(
      <div className="overlay">
        <form onSubmit={handleSubmit(onSubmit)} className="new-report">
          <label>Title:</label>
          <input type="text" placeholder="Title" {...register("title")}/>
          <p>{errors.title?.message}</p>
          <label>Description:</label>
          <input type="text" placeholder="Description" {...register("description")}/>
          <p>{errors.description?.message}</p>
          <button type="submit" className="submit-report">OK</button>
          <button type="button" onClick={onClose} className="cancel-report">Cancel</button>
        </form>
      </div>
    )
  }

  const EditReport = ({onClose, report}) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    });

    useEffect(() => {
      if (report) {
        setValue("title", report.title);
        setValue("description", report.description);
      }
    }, [report, setValue]);

    const onEditSubmit = async (data) => {
      try {
        const response = await fetch(`http://localhost:5000/api/reports/${report._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          const updatedReport = await response.json();
          setReports(prevReports=>
            prevReports.map(rp => rp._id === report._id ? updatedReport : rp)
          );
          onClose();
        } else {
          console.error("Failed to update transaction");
        }
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    };

    return(
      <div className="overlay">
        <form onSubmit={handleSubmit(onEditSubmit)} className="new-report">
          <label>Title:</label>
          <input type="text" placeholder="Title" {...register("title")}/>
          <p>{errors.title?.message}</p>
          <label>Description:</label>
          <input type="text" placeholder="Description" {...register("description")}/>
          <p>{errors.description?.message}</p>
          <button type="submit" className="submit-report">OK</button>
          <button type="button" onClick={onClose} className="cancel-report">Cancel</button>
        </form>
      </div>
    )
  }

  return(
    <div className="reports">
      <div className="reports-header">
        <h2>Reports:</h2>
        <button onClick={() => setIsFormVisible(true)} className="add-report">+Add Report</button>
        {isFormVisible && <AddReport onClose={() => setIsFormVisible(false)} />}
      </div>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <div className="reports-show">
          {reports.map((report) => (
            <div key={report._id} className="report">
              <div className="report-header">
              <button onClick={() => {setIsEditVisible(true);
                   setEditingReport(report);}} className="report-edit">
                  Edit
                </button>
                {isEditVisible && (
                <EditReport
                  onClose={() => setIsEditVisible(false)}
                report={editingReport}
                />
                )}
                <h3>{report.title}</h3>
                <button className="report-delete" onClick={() => deleteReport(report._id)}>Delete</button>
              </div>
              <p className="report-p">{report.description}</p>
            </div>
          ))}
          </div>)}
    </div>
  )
};

export default Reports;