'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Inventory as InventoryIcon,
  RestaurantMenu as RecipeIcon,
} from '@mui/icons-material';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const drawerWidth = 240;

const predefinedRecipes = [
  {
    name: 'Spaghetti Bolognese',
    details: 'A classic Italian pasta dish with rich, meaty sauce.',
    ingredients: [
      '200g spaghetti',
      '100g ground beef',
      '1 onion, chopped',
      '2 cloves garlic, minced',
      '400g canned tomatoes',
      '50g grated cheese',
      'Salt and pepper to taste',
    ],
    steps: [
      'Cook spaghetti according to package instructions.',
      'In a pan, cook ground beef until browned.',
      'Add chopped onion and minced garlic, cook until softened.',
      'Add canned tomatoes, simmer for 15 minutes.',
      'Season with salt and pepper.',
      'Serve sauce over spaghetti and top with grated cheese.',
    ],
  },
  {
    name: 'Chicken Curry',
    details: 'A spicy, flavorful dish with tender chicken pieces.',
    ingredients: [
      '500g chicken breast, diced',
      '1 onion, chopped',
      '3 cloves garlic, minced',
      '1 tbsp curry powder',
      '400ml coconut milk',
      '1 tbsp vegetable oil',
      'Salt and pepper to taste',
      'Fresh cilantro for garnish',
    ],
    steps: [
      'Heat oil in a pot over medium heat.',
      'Add chopped onion and minced garlic, cook until softened.',
      'Add diced chicken and cook until browned.',
      'Stir in curry powder and cook for 1 minute.',
      'Add coconut milk and bring to a boil.',
      'Reduce heat and simmer for 20 minutes.',
      'Season with salt and pepper.',
      'Garnish with fresh cilantro before serving.',
    ],
  },
  {
    name: 'Vegetable Stir Fry',
    details: 'A healthy and quick dish with mixed vegetables and soy sauce.',
    ingredients: [
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '100g broccoli florets',
      '2 tbsp soy sauce',
      '1 tbsp vegetable oil',
      '2 cloves garlic, minced',
      '1 tsp ginger, minced',
      'Cooked rice for serving',
    ],
    steps: [
      'Heat oil in a wok over high heat.',
      'Add minced garlic and ginger, cook for 30 seconds.',
      'Add sliced bell pepper, carrot, and broccoli, stir fry for 5 minutes.',
      'Add soy sauce and toss to coat.',
      'Serve with cooked rice.',
    ],
  },
];

function DashboardContent() {
  const [currentView, setCurrentView] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItemCount, setNewItemCount] = useState(1);
  const [newRecipe, setNewRecipe] = useState('');
  const [newRecipeDetails, setNewRecipeDetails] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
  const [newRecipeSteps, setNewRecipeSteps] = useState('');

  const fetchInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const fetchRecipes = async () => {
    const snapshot = await getDocs(collection(firestore, 'recipes'));
    const recipeList = [];
    snapshot.forEach((doc) => {
      recipeList.push({ id: doc.id, ...doc.data() });
    });
    setRecipes(recipeList);
  };

  useEffect(() => {
    fetchInventory();
    fetchRecipes();
  }, []);

  const handleAddItem = async () => {
    if (newItem && newItemCount > 0) {
      await addDoc(collection(firestore, 'inventory'), { name: newItem, count: newItemCount });
      setNewItem('');
      setNewItemCount(1);
      fetchInventory();
    }
  };

  const handleRemoveItem = async (id) => {
    await deleteDoc(doc(firestore, 'inventory', id));
    fetchInventory();
  };

  const handleUpdateItemCount = async (id, count) => {
    const itemRef = doc(firestore, 'inventory', id);
    await updateDoc(itemRef, { count });
    fetchInventory();
  };

  const handleAddRecipe = async () => {
    if (newRecipe && newRecipeDetails && newRecipeIngredients && newRecipeSteps) {
      await addDoc(collection(firestore, 'recipes'), {
        name: newRecipe,
        details: newRecipeDetails,
        ingredients: newRecipeIngredients.split('\n'),
        steps: newRecipeSteps.split('\n')
      });
      setNewRecipe('');
      setNewRecipeDetails('');
      setNewRecipeIngredients('');
      setNewRecipeSteps('');
      fetchRecipes();
    }
  };

  const handleRemoveRecipe = async (id) => {
    await deleteDoc(doc(firestore, 'recipes', id));
    fetchRecipes();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {currentView === 'inventory' ? 'Inventory' : 'Recipe'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button onClick={() => setCurrentView('inventory')}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('recipe')}>
            <ListItemIcon>
              <RecipeIcon />
            </ListItemIcon>
            <ListItemText primary="Recipe" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {currentView === 'inventory' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Inventory Management
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      label="New Item"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      label="Count"
                      type="number"
                      value={newItemCount}
                      onChange={(e) => setNewItemCount(parseInt(e.target.value))}
                      sx={{ mr: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddItem}>
                      Add Item
                    </Button>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.count}
                              onChange={(e) => handleUpdateItemCount(item.id, parseInt(e.target.value))}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Total Items: {inventory.reduce((total, item) => total + item.count, 0)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
          {currentView === 'recipe' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Recipe Management
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      label="New Recipe"
                      value={newRecipe}
                      onChange={(e) => setNewRecipe(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      label="Details"
                      value={newRecipeDetails}
                      onChange={(e) => setNewRecipeDetails(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      label="Ingredients (one per line)"
                      multiline
                      value={newRecipeIngredients}
                      onChange={(e) => setNewRecipeIngredients(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      label="Steps (one per line)"
                      multiline
                      value={newRecipeSteps}
                      onChange={(e) => setNewRecipeSteps(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddRecipe}>
                      Add Recipe
                    </Button>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Recipe Name</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predefinedRecipes.map((recipe, index) => (
                        <TableRow key={`predefined-${index}`}>
                          <TableCell>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>{recipe.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="subtitle1">Details</Typography>
                                <Typography>{recipe.details}</Typography>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Ingredients</Typography>
                                <ul>
                                  {recipe.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Steps</Typography>
                                <ol>
                                  {recipe.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ol>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                          <TableCell align="right">
                            <Button variant="contained" color="secondary" disabled>
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {recipes.map((recipe) => (
                        <TableRow key={recipe.id}>
                          <TableCell>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>{recipe.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="subtitle1">Details</Typography>
                                <Typography>{recipe.details}</Typography>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Ingredients</Typography>
                                <ul>
                                  {recipe.ingredients?.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Steps</Typography>
                                <ol>
                                  {recipe.steps?.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ol>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRemoveRecipe(recipe.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
