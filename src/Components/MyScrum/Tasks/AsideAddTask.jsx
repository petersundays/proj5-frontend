import "../../General/Asides.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { UserStore } from "../../../Stores/UserStore.jsx";
import { showErrorMessage } from "../../../functions/Messages/ErrorMessage";
import { showSuccessMessage } from "../../../functions/Messages/SuccessMessage";
import { showWarningMessage } from "../../../functions/Messages/WarningMessage.js";
import { CategoriesStore } from "../../../Stores/CategoriesStore.jsx";
import PriorityButtons from "../../General/PriorityButtons.jsx";
import Button from "../../General/Button.jsx";
import { getTasksFromUser } from "../../../functions/Tasks/GetTasksFromUser.js";
import { AllTasksStore } from "../../../Stores/AllTasksStore.jsx";
import { StatisticsStore } from "../../../Stores/StatisticsStore.jsx";
import { useTranslation } from 'react-i18next';

function AsideAddTask() {
  
  const { t } = useTranslation();

  const token = UserStore.getState().user.token;
  const { sendMessage } = StatisticsStore((state) => ({
    sendMessage: state.sendMessage,
  }));

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskLimitDate, setTaskLimitDate] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [resetPriority, setResetPriority] = useState(false);

  //const isAsideVisible = UserStore((state) => state.isAsideVisible);

  useEffect(() => {
    if (!categoriesLoaded) {
      getCategoriesNames();
    }
  }, [categoriesLoaded]);

  useEffect(() => {
    if (resetPriority) {
      setTaskPriority("");
      setResetPriority(false);
    }
  }, [resetPriority]);

  const getCategoriesNames = async () => {
    const categories = await getAllCategories();
    setCategories(categories);
    setCategoriesLoaded(true);
  };

  const createSelectOptions = () => {
    return categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ));
  };

  const handleTaskTitle = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleTaskDescription = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleTaskPriority = (priority) => {
    setTaskPriority(priority);
  };

  const handleTaskStartDate = (e) => {
    setTaskStartDate(e.target.value);
  };

  const handleTaskLimitDate = (e) => {
    setTaskLimitDate(e.target.value);
  };

  const handleTaskCategory = (e) => {
    setTaskCategory(e.target.value);
  };

  const isAnyFieldEmpty = () => {
    if (
      taskTitle === "" ||
      taskDescription === "" ||
      taskPriority === "" ||
      taskStartDate === "" ||
      taskLimitDate === "" ||
      taskCategory === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const clearAndDisableAllFields = () => {
    setTaskTitle("");
    setTaskDescription("");
    setResetPriority(true);
    setTaskStartDate("");
    setTaskLimitDate("");
    setTaskCategory("");
  };

  const getAllCategories = async () => {
    const categoriesRequest =
      "http://localhost:8080/backend_proj5_war_exploded/rest/categories";
    try {
      const response = await fetch(categoriesRequest, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: token,
        },
      });

      if (response.ok) {
        const categories = await response.json();
        const categoriesNames = categories.map((category) => category.name);
        CategoriesStore.getState().setCategories(categoriesNames);
        return categoriesNames;
      } else {
        const error = await response.text();
        showErrorMessage("Error: " + error);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorMessage("Something went wrong. Please try again later.");
      return [];
    }
  };

  const addNewTask = async () => {
    if (isAnyFieldEmpty()) {
      showWarningMessage("Please fill all the fields.");
    } else {
      const username = UserStore.getState().user.username;
      const category = {
        name: taskCategory,
      };
      const task = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        startDate: taskStartDate,
        limitDate: taskLimitDate,
        category: category,
      };

      const addTask = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks`;
      try {
        const response = await fetch(addTask, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
            username: username,
          },
          body: JSON.stringify(task),
        });

        if (response.ok) {
          showSuccessMessage("Task added successfully: " + taskTitle);
          clearAndDisableAllFields();
        } else {
          const error = await response.text();
          showErrorMessage("Error: " + error);
        }
      } catch (error) {
        console.error("Error:", error);
        showErrorMessage("Something went wrong. Please try again later.");
      }
      const updateMyTasks = await getTasksFromUser(username, token);
      AllTasksStore.setState({ tasks: updateMyTasks });
      sendMessage();
    }
  };
  return (
    <>
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h3 id="offcanvasExampleLabel">{t('Add task')}</h3>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label={t('Close')}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="add-task-container task-inputs-container">
            <input
              type="text"
              id="taskName"
              placeholder={t('Title (required)')}
              maxLength="15"
              value={taskTitle}
              onChange={handleTaskTitle}
              required
            />
            <textarea
              id="taskDescription"
              placeholder={t('Description (required)')}
              value={taskDescription}
              onChange={handleTaskDescription}
              required
            ></textarea>

            <label className="labels-task-priority" id="label-priority">
              {t('Priority')}
            </label>
            <PriorityButtons
              onSelectPriority={handleTaskPriority}
              reset={resetPriority}
            />
            <label className="labels-task-dates" id="label-startDate">
              {t('Start date')}
            </label>
            <input
              type="date"
              id="task-startDate"
              value={taskStartDate}
              onChange={handleTaskStartDate}
              required
            />
            <label className="labels-task-dates" id="label-limitDate">
              {t('End date')}
            </label>
            <input
              type="date"
              id="task-limitDate"
              value={taskLimitDate}
              onChange={handleTaskLimitDate}
              required
            />
            <label className="labels-task-category" id="label-category">
              {t('Category')}
            </label>
            <select
              id="task-category"
              value={taskCategory}
              onChange={handleTaskCategory}
              required
            >
              <option value="" disabled>
                {t('Select category')}
              </option>
              {createSelectOptions()}
            </select>
            <Button text={t('Add Task')} onClick={addNewTask}></Button>
            <p id="warningMessage2"></p>
          </div>
        </div>
      </div>
    </>
  );
}
export default AsideAddTask;
