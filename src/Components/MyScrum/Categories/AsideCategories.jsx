import React, { useState, useEffect } from 'react';
import Button from '../../General/Button.jsx';
import { UserStore } from '../../../Stores/UserStore.jsx';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage'; 
import { CategoriesStore } from '../../../Stores/CategoriesStore.jsx';
import { ConfirmationModal } from '../../General/ConfirmationModal.jsx';
import { getTasksByCategory } from '../../../functions/Tasks/GetTasksByCategory.js';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks.js';
import { AllTasksStore } from '../../../Stores/AllTasksStore.jsx';
import { useTranslation } from 'react-i18next';

function AsideCategories() {

    const token = UserStore.getState().user.token;

    const { t } = useTranslation();


    const [newCategory, setNewCategory] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [displayCategoryModal, setDisplayCategoryModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [tasks, setTasks] = useState({ tasks: [] });

    
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const message = "Are you sure you want to delete this category?";
    
   
    useEffect(() => {
        {
            getCategoriesNames(); 
        }
            const unsubscribe = AllTasksStore.subscribe(
            (newTasks) => {
                setTasks(newTasks);
            },
            (state) => state.tasks,
        );
        

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        async function fetchTasks() {
            if (selectedCategory !== '') {
                const selectedCategoryTasks = await getTasksByCategory(selectedCategory, token);
                AllTasksStore.setState({ tasks: selectedCategoryTasks });
            } else {
                const allTasks = await getAllTasks(token);
                AllTasksStore.setState({ tasks: allTasks });
            }
        }
        fetchTasks();
    }, [selectedCategory]);



    const handleDisplayConfirmationModal = () => {
        
        if (AllTasksStore.getState().tasks.length > 0) {
            showErrorMessage('Category cannot be deleted. There are tasks associated with this category.');
            return;
        } else {
            setDisplayConfirmationModal(!displayConfirmationModal);
        }
    }

    const handleNewCategory = (e) => {
        setNewCategory(e.target.value);
    }

const handleCategorySearch = (e) => {
    const searchValue = e.target.value;
    setCategorySearch(searchValue);

    if (searchValue === '') {
        setSelectedCategory('');
    } else {
        const matchingCategory = categories.find(category => category.toLowerCase().includes(searchValue.toLowerCase()));
        if (matchingCategory) {
            setSelectedCategory(matchingCategory);
        }
    }
}

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    }

    const handleCategoryModal = () => {
        if (selectedCategory === '') {
            showErrorMessage('Please select a category to edit.');
        } else {
            setDisplayCategoryModal(!displayCategoryModal);
        }
    }; 

    const handleNewName = (e) => {
        setNewName(e.target.value);
    }


    const getCategoriesNames = async () => {
        
        setCategories(CategoriesStore.getState().categories);
    }

    const createSelectOptions = () => {

        if (categorySearch === '') {
            return categories.map(category => (
                <option key={category} value={category}>{category}</option>
            ));
        } else {
            return categories
            .filter(category => category.toLowerCase().includes(categorySearch.toLowerCase()))
            .map(category => (
                <option key={category} value={category}>{category}</option>
                
            ));
        }
    }

    const handleDeleteCategory = () => {

            deleteCategory();
            setDisplayConfirmationModal(false);
    }



    const handleCategoryEdition = async () => {

        const editCategory = `http://localhost:8080/backend_proj5_war_exploded/rest/categories/${selectedCategory}`;
        try {
            const response = await fetch(editCategory, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token,
                    newCategoryName: newName
                },
            });

            if (response.ok) {
                showSuccessMessage("Category edited successfully: " + newName);
                setCategories(prevCategories => prevCategories.map(cat => cat === selectedCategory ? newName : cat));
                setSelectedCategory(newName);
                setDisplayCategoryModal(false);
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        }
        catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    }     


    const createCategory = async () => {

        const category = {
            name: newCategory
        }

        const newCategoryUrl = "http://localhost:8080/backend_proj5_war_exploded/rest/categories";

        try {
            const response = await fetch(newCategoryUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                },
                body: JSON.stringify(category)
            });

            if (response.ok) {
                showSuccessMessage("New category created successfully: " + category.name);
                setCategories(prevCategories => [...prevCategories, newCategory]);
                CategoriesStore.setState({ categories: [...categories, newCategory] });
                setNewCategory('');
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    }

    const deleteCategory = async () => {

        const category = {
            name: selectedCategory
        }

        const deleteCategoryUrl = `http://localhost:8080/backend_proj5_war_exploded/rest/categories/${category.name}`;

        try {
            const response = await fetch(deleteCategoryUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                },
            });

            if (response.ok) {
                showSuccessMessage("Category deleted successfully: " + category.name);
                setCategories(prevCategories => prevCategories.filter(cat => cat !== category.name));
                CategoriesStore.setState({ categories: categories.filter(cat => cat !== category.name) });
                setSelectedCategory('');
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    }
  

    return (
        <>
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div className="offcanvas-header">
              <h5 id="offcanvasExampleLabel">{t('categories')}</h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label={t('close')}
              ></button>
            </div>
            <div className="offcanvas-body">
              <ConfirmationModal
                onConfirm={handleDeleteCategory}
                onCancel={handleDisplayConfirmationModal}
                message={message}
                displayModal={displayConfirmationModal}
              />
              <div className="add-task-container">
                <h3 id="categories-h3">{t('categories')}</h3>
                <div className="category-search-container">
                  <label className="labels-search-category" id="label-category">
                    {t('search')}
                  </label>
                  <input
                    type="search"
                    id="search-category"
                    placeholder={t('categories')}
                    onChange={handleCategorySearch}
                  />
                </div>
                <select
                  id="task-category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">{t('allCategories')}</option>
                  {createSelectOptions()}
                </select>
                <div id="category-buttons-container">
                  <Button text={t('edit')} width="120px" onClick={handleCategoryModal} />
                  <Button
                    text={t('delete')}
                    width="120px"
                    onClick={handleDisplayConfirmationModal}
                  />
                </div>
                <div className="space-between"></div>
                <label className="labels-create-category" id="label-category">
                  {t('newCategory')}
                </label>
                <input
                  type="text"
                  id="create-category-name"
                  placeholder={t('categories')}
                  value={newCategory}
                  onChange={handleNewCategory}
                />
                <Button text={t('create')} onClick={createCategory} />
              </div>
              <div
                id="passwordModal"
                className={`modal ${displayCategoryModal ? "modalShown" : ""}`}
              >
                <div className="modalContent">
                  <label>{t('currentName')}</label>
                  <input
                    type="text"
                    id="category-current-name"
                    value={selectedCategory}
                    readOnly
                  />
                  <label>{t('newName')}</label>
                  <input
                    type="text"
                    id="category-new-name"
                    placeholder={t('newName')}
                    onChange={handleNewName}
                    required
                  />
                  <div className="modal-buttons">
                    <Button text={t('cancel')} onClick={handleCategoryModal} />
                    <Button type="submit" text={t('save')} onClick={handleCategoryEdition} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

export default AsideCategories;
