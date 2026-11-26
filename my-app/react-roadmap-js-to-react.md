# React Roadmap for a Strong Vanilla JavaScript Developer

> **Target:** Go from strong HTML/CSS/JavaScript knowledge to building production-quality React applications.
>
> **Assumption:** You already understand JavaScript well, including DOM manipulation, events, modules, async/await, fetch, arrays/objects, classes/functions, and you have already built UI components such as dropdowns, trees, and similar widgets in vanilla JS.
>
> **React baseline:** This roadmap targets modern React 19.x. Learn the core concepts first; React 19-specific features are intentionally placed near the end.

---

# 0. The Most Important Mental Shift

Before React, you probably think like this:

```js
const button = document.querySelector("#button");
const counter = document.querySelector("#counter");

let count = 0;

button.addEventListener("click", () => {
  count++;
  counter.textContent = count;
});
```

The mental model is:

1. Find a DOM node.
2. Listen for something.
3. Mutate data.
4. Manually mutate the DOM.

React changes this model.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
}
```

The React mental model is:

1. Store application state.
2. Describe what the UI should look like for that state.
3. Change state.
4. React re-renders the UI.

Think:

```text
UI = function(state)
```

instead of:

```text
Find DOM -> mutate DOM -> find another DOM -> mutate it
```

That mental shift is more important than memorizing hooks.

---

# 1. Recommended Learning Order

Do **not** try to learn everything at once.

Use this order:

1. React setup and JSX
2. Components
3. Props
4. Events
5. `useState`
6. Conditional rendering
7. Lists and keys
8. Forms
9. Component composition
10. State ownership and lifting state
11. `useEffect`
12. Data fetching
13. `useRef`
14. Custom hooks
15. Context
16. `useReducer`
17. Reducer + Context
18. Routing
19. Performance
20. Error handling
21. Suspense and lazy loading
22. React 19 features
23. State-management libraries
24. Data-fetching libraries
25. Testing
26. TypeScript with React
27. Architecture
28. Production application

---

# 2. Project Setup

For learning plain React, use **Vite**.

```bash
npm create vite@latest
```

Choose:

```text
React
JavaScript
```

Then:

```bash
cd my-app
npm install
npm run dev
```

Typical structure:

```text
src/
├── App.jsx
├── main.jsx
├── components/
├── hooks/
├── pages/
├── services/
├── utils/
└── assets/
```

Later, after becoming comfortable with React itself, learn a React framework such as Next.js if your work requires SSR, server components, routing, backend integration, or full-stack React.

---

# 3. JSX

## Vanilla JavaScript

```js
const card = document.createElement("div");
card.className = "card";

const title = document.createElement("h2");
title.textContent = product.name;

card.append(title);
```

## React

```jsx
function ProductCard({ product }) {
  return (
    <div className="card">
      <h2>{product.name}</h2>
    </div>
  );
}
```

JSX is syntax that lets you describe a UI tree inside JavaScript.

## Important differences from HTML

HTML:

```html
<div class="card">
  <label for="email">Email</label>
</div>
```

JSX:

```jsx
<div className="card">
  <label htmlFor="email">Email</label>
</div>
```

JavaScript expressions go inside:

```jsx
{}
```

Example:

```jsx
<h1>{user.name}</h1>
```

You can execute expressions:

```jsx
<p>{price * quantity}</p>
```

But not normal statements directly:

```jsx
// invalid
<div>
  {if (loggedIn) {}}
</div>
```

Instead:

```jsx
<div>
  {loggedIn ? <Dashboard /> : <Login />}
</div>
```

---

# 4. Components

A React component is normally a JavaScript function.

```jsx
function Button() {
  return <button>Save</button>;
}
```

Use it:

```jsx
function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  );
}
```

## Vanilla JS analogy

You might previously write:

```js
function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  return button;
}
```

React:

```jsx
function Button({ text }) {
  return <button>{text}</button>;
}
```

The React component does not normally construct and mutate DOM nodes manually.

It **describes** the UI.

---

# 5. Props

Props are arguments passed from parent components to child components.

## Vanilla JS

```js
function createButton(text, disabled) {
  const button = document.createElement("button");

  button.textContent = text;
  button.disabled = disabled;

  return button;
}
```

## React

```jsx
function Button({ text, disabled }) {
  return (
    <button disabled={disabled}>
      {text}
    </button>
  );
}
```

Use:

```jsx
<Button text="Delete" disabled={false} />
```

Props should be treated as read-only.

Bad:

```jsx
function Button(props) {
  props.text = "Changed";
}
```

Good:

```jsx
function Button({ text }) {
  return <button>{text}</button>;
}
```

## Key idea

```text
Parent owns data
       ↓
     props
       ↓
Child receives data
```

---

# 6. Children

Vanilla JavaScript UI libraries often accept content or nested elements.

React has a special prop:

```jsx
children
```

Example:

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

Usage:

```jsx
<Card>
  <h2>Product</h2>
  <p>Description</p>
</Card>
```

This is one of the foundations of React component composition.

---

# 7. Events

## Vanilla JS

```js
button.addEventListener("click", handleClick);
```

## React

```jsx
<button onClick={handleClick}>
  Click
</button>
```

Example:

```jsx
function App() {
  function handleClick() {
    console.log("clicked");
  }

  return <button onClick={handleClick}>Click</button>;
}
```

Do not do:

```jsx
<button onClick={handleClick()}>
```

That calls the function during render.

Instead:

```jsx
<button onClick={handleClick}>
```

or:

```jsx
<button onClick={() => handleClick(id)}>
```

---

# 8. State with `useState`

State is data that changes over time and affects the UI.

## Vanilla JS

```js
let open = false;

button.addEventListener("click", () => {
  open = !open;

  menu.style.display = open ? "block" : "none";
});
```

## React

```jsx
function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        Menu
      </button>

      {open && <div className="menu">...</div>}
    </div>
  );
}
```

## Main rule

Do not mutate state directly.

Bad:

```jsx
count++;
```

Good:

```jsx
setCount(count + 1);
```

For updates based on previous state:

```jsx
setCount(prev => prev + 1);
```

This is especially important when React batches updates.

---

# 9. React State Is a Snapshot

This surprises many JavaScript developers.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);

    console.log(count);
  }
}
```

The log still prints the current render's `count`.

Calling:

```js
setCount(...)
```

requests another render.

It does not mutate the variable inside the already-running function.

Think of each render as receiving a snapshot:

```text
Render #1: count = 0
Render #2: count = 1
Render #3: count = 2
```

---

# 10. State with Objects

Vanilla JS:

```js
user.name = "Giorgi";
```

React state should usually be treated immutably.

Bad:

```jsx
user.name = "Giorgi";
setUser(user);
```

Good:

```jsx
setUser({
  ...user,
  name: "Giorgi"
});
```

Example:

```jsx
const [user, setUser] = useState({
  name: "",
  age: 21
});

function changeName(name) {
  setUser(prev => ({
    ...prev,
    name
  }));
}
```

---

# 11. State with Arrays

Bad:

```jsx
items.push(newItem);
setItems(items);
```

Good:

```jsx
setItems(prev => [...prev, newItem]);
```

Delete:

```jsx
setItems(prev =>
  prev.filter(item => item.id !== id)
);
```

Update:

```jsx
setItems(prev =>
  prev.map(item =>
    item.id === id
      ? { ...item, completed: true }
      : item
  )
);
```

These operations should become automatic for you.

---

# 12. Conditional Rendering

## Vanilla JS

```js
if (loggedIn) {
  dashboard.style.display = "block";
} else {
  login.style.display = "block";
}
```

## React

```jsx
return loggedIn
  ? <Dashboard />
  : <Login />;
```

Common patterns:

### Ternary

```jsx
{loggedIn ? <Dashboard /> : <Login />}
```

### AND

```jsx
{error && <ErrorMessage />}
```

### Early return

```jsx
function Profile({ user }) {
  if (!user) {
    return <Login />;
  }

  return <ProfilePage user={user} />;
}
```

---

# 13. Lists

## Vanilla JS

```js
products.forEach(product => {
  const element = createProductElement(product);
  container.append(element);
});
```

## React

```jsx
function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
```

---

# 14. Keys

Keys help React identify list items.

Good:

```jsx
items.map(item => (
  <Item
    key={item.id}
    item={item}
  />
))
```

Avoid indexes when order can change:

```jsx
items.map((item, index) => (
  <Item key={index} />
))
```

Index keys can cause state bugs during:

- sorting
- inserting
- deleting
- dragging/reordering

Use a stable unique ID.

---

# 15. Forms

## Vanilla JS

```js
const input = document.querySelector("#name");

input.addEventListener("input", e => {
  console.log(e.target.value);
});
```

## React Controlled Input

```jsx
function Form() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
}
```

The value is controlled by React state.

Flow:

```text
User types
   ↓
onChange
   ↓
setState
   ↓
render
   ↓
input receives new value
```

## Full form

```jsx
function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <button>Register</button>
    </form>
  );
}
```

---

# 16. Component Composition

React favors composition.

Instead of creating giant configurable components:

```jsx
<Modal
  title="Delete"
  body="..."
  footer="..."
  showCloseButton
  ...
/>
```

you can build:

```jsx
<Modal>
  <ModalHeader>
    Delete account
  </ModalHeader>

  <ModalBody>
    Are you sure?
  </ModalBody>

  <ModalFooter>
    <Button>Cancel</Button>
    <Button>Delete</Button>
  </ModalFooter>
</Modal>
```

This is similar to building reusable UI primitives in vanilla JS, but React makes nesting components natural.

---

# 17. State Ownership

A fundamental React question is:

> Which component should own this state?

Example:

```text
SearchPage
├── SearchInput
└── SearchResults
```

Both components need the search query.

Do not duplicate state.

Bad:

```text
SearchInput has query
SearchResults has another query
```

Instead:

```text
SearchPage owns query
       ↓
props to SearchInput
       ↓
props to SearchResults
```

Example:

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchInput
        query={query}
        onQueryChange={setQuery}
      />

      <SearchResults query={query} />
    </>
  );
}
```

---

# 18. Lifting State Up

Suppose two components need synchronized state.

Vanilla JS might use:

- shared variables
- custom events
- event bus
- parent controller
- global state object

React's first solution is usually:

> Move the state to their nearest common parent.

This is called **lifting state up**.

---

# 19. Controlled vs Uncontrolled Components

Controlled:

```jsx
<Tabs
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

The parent controls state.

Uncontrolled:

```jsx
<Tabs />
```

The Tabs component manages its own state.

If you have built vanilla JS UI libraries, this distinction should feel familiar.

A flexible component may support both styles.

---

# 20. `useEffect`

This is one of the most misunderstood React hooks.

Use an effect to synchronize React with something outside React.

Examples:

- browser APIs
- network connections
- timers
- event listeners
- third-party libraries
- subscriptions

Example:

```jsx
useEffect(() => {
  document.title = `Messages ${count}`;
}, [count]);
```

## Vanilla JS analogy

```js
function updateTitle(count) {
  document.title = `Messages ${count}`;
}
```

React automatically runs the synchronization after rendering when dependencies change.

---

# 21. Effect Dependencies

```jsx
useEffect(() => {
  console.log(userId);
}, [userId]);
```

Meaning:

> Re-run this synchronization when `userId` changes.

No dependencies:

```jsx
useEffect(() => {
  console.log("after every render");
});
```

Empty array:

```jsx
useEffect(() => {
  console.log("mount");
}, []);
```

But don't think of effects only as lifecycle callbacks.

Better mental model:

> This effect synchronizes this component with an external system.

---

# 22. Effect Cleanup

Vanilla JS:

```js
window.addEventListener("resize", handleResize);

// later

window.removeEventListener("resize", handleResize);
```

React:

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

Timers:

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("tick");
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

---

# 23. When NOT to Use `useEffect`

A common beginner mistake:

```jsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);
```

Don't create state for values you can calculate.

Use:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Also avoid effects for event logic.

Bad:

```jsx
useEffect(() => {
  if (submitted) {
    sendForm();
  }
}, [submitted]);
```

Better:

```jsx
function handleSubmit() {
  sendForm();
}
```

Rule:

```text
Event happened because user did something?
→ event handler

Something must stay synchronized with external system?
→ effect
```

---

# 24. Fetching Data

Basic example:

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

For real production applications, later learn a server-state library such as:

- TanStack Query
- SWR

These handle:

- caching
- refetching
- retries
- loading states
- stale data
- request deduplication
- mutations

---

# 25. Race Conditions in Fetching

Suppose:

```text
User selects user 1
request starts

User immediately selects user 2
request starts

user 2 response returns

user 1 response returns later
```

The older response can overwrite the newer one.

Use cleanup / abort logic.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUser() {
    const response = await fetch(
      `/api/users/${userId}`,
      { signal: controller.signal }
    );

    const data = await response.json();

    setUser(data);
  }

  loadUser();

  return () => {
    controller.abort();
  };
}, [userId]);
```

Understanding race conditions is important for production React.

---

# 26. `useRef`

A ref stores a mutable value that survives renders without triggering another render.

## DOM access

Vanilla JS:

```js
const input = document.querySelector("#search");
input.focus();
```

React:

```jsx
function Search() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />

      <button onClick={focusInput}>
        Focus
      </button>
    </>
  );
}
```

## Store mutable value

```jsx
const timerRef = useRef(null);
```

Changing:

```js
timerRef.current
```

does not re-render the component.

Use state when the UI needs the value.

Use ref when React does not need to render because of the value.

---

# 27. State vs Ref

Use `useState`:

```text
Value changes
AND
UI must update
```

Use `useRef`:

```text
Value changes
BUT
UI does not need to update
```

Examples for refs:

- DOM node
- interval ID
- timeout ID
- previous value
- third-party library instance
- mutable cache
- latest callback/value in some patterns

---

# 28. Custom Hooks

A custom hook extracts reusable React logic.

Example:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);

    return stored
      ? JSON.parse(stored)
      : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);

  return [value, setValue];
}
```

Use:

```jsx
const [theme, setTheme] =
  useLocalStorage("theme", "dark");
```

Analogy:

```text
Normal JS function
→ reuses ordinary logic

React custom hook
→ reuses React state/effect/ref logic
```

Naming rule:

```text
useSomething
```

---

# 29. Rules of Hooks

Hooks must normally be called at the top level.

Bad:

```jsx
if (loggedIn) {
  useState();
}
```

Bad:

```jsx
for (...) {
  useEffect(...);
}
```

Good:

```jsx
const [user, setUser] = useState(null);

if (!loggedIn) {
  return <Login />;
}
```

React relies on stable hook ordering.

---

# 30. Context

Props work well:

```text
App
 ↓
Dashboard
 ↓
Sidebar
 ↓
Profile
```

But if every level only forwards the same value:

```text
user
theme
language
permissions
```

you may want Context.

Create:

```jsx
const ThemeContext = createContext(null);
```

Provide:

```jsx
function App() {
  return (
    <ThemeContext value="dark">
      <Dashboard />
    </ThemeContext>
  );
}
```

Read:

```jsx
function Button() {
  const theme = useContext(ThemeContext);

  return (
    <button className={theme}>
      Save
    </button>
  );
}
```

---

# 31. Context vs Global Variable

Vanilla global:

```js
window.currentUser = user;
```

Problems:

- hard to track
- not reactive
- hard to isolate
- hidden dependencies
- testing issues

Context participates in React's component tree.

But Context is **not automatically a replacement for all application state management**.

Good Context examples:

- theme
- authenticated user
- locale
- permissions
- feature flags
- shared reducer

---

# 32. `useReducer`

Use `useReducer` when state transitions become complex.

Simple state:

```jsx
const [count, setCount] = useState(0);
```

Complex state:

```text
add
remove
rename
select
move
toggle
reset
import
```

A reducer centralizes state transitions.

Example:

```jsx
function tasksReducer(state, action) {
  switch (action.type) {
    case "added":
      return [
        ...state,
        action.task
      ];

    case "deleted":
      return state.filter(
        task => task.id !== action.id
      );

    case "toggled":
      return state.map(task =>
        task.id === action.id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      );

    default:
      throw new Error(
        `Unknown action: ${action.type}`
      );
  }
}
```

Use:

```jsx
const [tasks, dispatch] = useReducer(
  tasksReducer,
  initialTasks
);
```

Dispatch:

```jsx
dispatch({
  type: "deleted",
  id
});
```

---

# 33. Vanilla JS Analogy for Reducers

A reducer is similar to building a central state machine.

Vanilla:

```js
function updateState(state, event) {
  switch (event.type) {
    case "OPEN":
      return {
        ...state,
        open: true
      };

    case "CLOSE":
      return {
        ...state,
        open: false
      };
  }
}
```

React's `useReducer` integrates this pattern with rendering.

The core idea is not React-specific:

```text
previous state + action
        ↓
      reducer
        ↓
    next state
```

---

# 34. Context + Reducer

For medium-sized application state:

```text
Context
   +
useReducer
```

can be enough.

Architecture:

```text
TasksProvider
├── reducer
├── state
├── dispatch
│
└── application tree
```

Any child can:

```jsx
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

This can replace a simple global event bus/store.

---

# 35. Derived State

Avoid storing duplicate information.

Bad:

```jsx
const [items, setItems] = useState([]);
const [completedItems, setCompletedItems] = useState([]);
```

`completedItems` can be derived:

```jsx
const completedItems =
  items.filter(item => item.completed);
```

Bad state design creates synchronization bugs.

Ask:

> Can I calculate this from existing props/state?

If yes, usually calculate it.

---

# 36. Single Source of Truth

If two values represent the same underlying information, one should normally be derived from the other.

Bad:

```text
selectedUserId
selectedUser object
```

Both can become inconsistent.

Better:

```jsx
const [selectedUserId, setSelectedUserId] =
  useState(null);

const selectedUser =
  users.find(
    user => user.id === selectedUserId
  );
```

---

# 37. Preserving and Resetting State

React associates state with a component's position in the tree.

Consider:

```jsx
{show ? <Counter /> : null}
```

Removing the component destroys its local state.

Keys can intentionally reset state.

```jsx
<UserForm key={user.id} user={user} />
```

When `user.id` changes, React treats it as another component instance.

Useful for:

- edit forms
- chat conversations
- wizard steps
- dynamic editors

---

# 38. Reconciliation

When React renders again, it compares the next component tree with the previous one.

React determines:

- what can stay
- what changed
- what DOM operations are needed
- which component state should be preserved

You do **not** need to implement reconciliation yourself.

But understanding it explains:

- why keys matter
- why component position matters
- why state may reset
- why rendering does not mean rebuilding the entire DOM

---

# 39. Render vs Commit

React work can be thought of in phases.

## Render

React calls components and calculates what UI should exist.

```text
component functions execute
```

## Commit

React applies necessary changes to the DOM.

Important:

> Rendering a component does not necessarily mean the browser DOM changed.

This becomes important when debugging performance.

---

# 40. Pure Rendering

Components should generally be pure during rendering.

Bad:

```jsx
function Component() {
  localStorage.setItem("x", "1");

  return <div>Hello</div>;
}
```

Bad:

```jsx
function Component() {
  fetch("/api/log-render");

  return <div>Hello</div>;
}
```

Render should mainly calculate JSX.

External side effects belong in:

- event handlers
- effects
- framework/server logic where appropriate

---

# 41. Routing

React itself does not provide the normal client-side routing experience used by most SPAs.

Learn React Router or your framework's router.

React Router concepts:

```text
URL
 ↓
Route
 ↓
Page component
```

Example:

```jsx
<Routes>
  <Route path="/" element={<Home />} />

  <Route
    path="/users"
    element={<Users />}
  />

  <Route
    path="/users/:id"
    element={<User />}
  />
</Routes>
```

Learn:

- routes
- nested routes
- parameters
- query strings
- navigation
- layouts
- protected routes
- loaders if using the router's data APIs
- error routes
- 404 handling

---

# 42. Layout Components

Example:

```jsx
function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

Useful hierarchy:

```text
Root Layout
├── Public pages
└── Dashboard Layout
    ├── Users
    ├── Projects
    └── Settings
```

---

# 43. Authentication UI

You should understand:

```text
auth state
loading auth state
logged-out state
logged-in state
permissions
route protection
token/session refresh
logout
```

Example UI state:

```jsx
if (loading) {
  return <SplashScreen />;
}

if (!user) {
  return <Login />;
}

return <Dashboard />;
```

Do not rely on frontend route protection for security.

Backend authorization remains mandatory.

---

# 44. API Layer

Avoid scattering raw `fetch()` calls everywhere.

Instead:

```text
services/
  users.js
  projects.js
  auth.js
```

Example:

```js
export async function getUsers() {
  const response =
    await fetch("/api/users");

  if (!response.ok) {
    throw new Error(
      "Failed to load users"
    );
  }

  return response.json();
}
```

Component:

```jsx
const users = await getUsers();
```

This separates HTTP logic from UI logic.

---

# 45. Loading, Error, Empty, Success

Every remote-data page should consider at least four states:

```text
Loading
Error
Empty
Success
```

Example:

```jsx
if (loading) {
  return <UsersSkeleton />;
}

if (error) {
  return <ErrorState />;
}

if (users.length === 0) {
  return <EmptyUsers />;
}

return <UsersTable users={users} />;
```

Do not build only the happy path.

---

# 46. Optimistic UI

Example:

User clicks:

```text
Delete
```

Instead of waiting for the server before updating UI:

```text
1. Remove item immediately
2. Send server request
3. Restore if request fails
```

This is optimistic UI.

You should understand:

- optimistic mutation
- rollback
- pending state
- disabled actions
- retry
- conflict handling

React 19 includes APIs that support action/pending/optimistic patterns, but first understand the underlying concept.

---

# 47. `React.memo`

A component normally renders again when its parent renders.

Sometimes you can skip unnecessary renders.

```jsx
const UserCard = memo(function UserCard({
  user
}) {
  return <div>{user.name}</div>;
});
```

Do not automatically wrap everything in `memo`.

First understand why something is slow.

---

# 48. `useMemo`

Caches a calculated value between renders.

```jsx
const filteredUsers = useMemo(() => {
  return users.filter(user =>
    user.name.includes(search)
  );
}, [users, search]);
```

Do not use `useMemo` for every calculation.

Bad:

```jsx
const total = useMemo(
  () => price * quantity,
  [price, quantity]
);
```

The calculation is trivial.

---

# 49. `useCallback`

Caches a function identity.

```jsx
const handleDelete =
  useCallback(id => {
    deleteUser(id);
  }, []);
```

Main use cases involve:

- memoized child components
- hook dependencies
- libraries requiring stable callbacks

Do not use `useCallback` everywhere by default.

---

# 50. React Compiler

Modern React can use the React Compiler, which can automatically optimize certain memoization patterns.

You should still understand:

- re-rendering
- reference equality
- memoization
- pure components

because architecture and debugging still require these concepts.

But avoid turning `useMemo` and `useCallback` into reflexes.

---

# 51. Code Splitting

Without code splitting:

```text
browser downloads entire application
```

With code splitting:

```text
browser downloads code when needed
```

Example:

```jsx
const AdminPage = lazy(
  () => import("./AdminPage")
);
```

Then:

```jsx
<Suspense fallback={<Spinner />}>
  <AdminPage />
</Suspense>
```

Use for:

- routes
- heavy editors
- admin panels
- charts
- optional features

---

# 52. Suspense

Suspense allows part of the UI to show a fallback while something is waiting.

```jsx
<Suspense fallback={<Loading />}>
  <Profile />
</Suspense>
```

You should understand Suspense conceptually before learning framework-specific server rendering patterns.

Think:

```text
This subtree isn't ready
       ↓
nearest Suspense boundary
       ↓
show fallback
```

---

# 53. Error Boundaries

An error boundary prevents a rendering error in one section from destroying the entire application UI.

Concept:

```text
Application
├── Sidebar
├── ErrorBoundary
│   └── Reports
└── Footer
```

If Reports crashes, the boundary can show:

```text
"Reports failed to load"
```

while the rest of the application remains usable.

Learn:

- render errors
- fallback UI
- retry/reset behavior
- logging

---

# 54. Portals

You may have created modal DOM nodes manually.

Vanilla:

```js
document.body.append(modal);
```

React Portal:

```jsx
createPortal(
  <Modal />,
  document.body
);
```

Useful for:

- modals
- tooltips
- dropdown overlays
- context menus

The React component stays inside the React component tree even though its DOM is rendered elsewhere.

---

# 55. Building a Dropdown: Vanilla JS vs React

You said you have already built UI components such as dropdowns.

## Vanilla mental model

```text
create DOM
attach listener
track open flag
toggle class
listen outside click
handle keyboard
remove listeners on destroy
```

## React mental model

```text
state: open
state: selectedItem
ref: trigger
ref: menu
effect: outside-click listener
event handlers: keyboard/mouse
render: menu from state
props: items/options
```

Example skeleton:

```jsx
function Dropdown({
  options,
  value,
  onChange
}) {
  const [open, setOpen] =
    useState(false);

  const rootRef = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (
        !rootRef.current?.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  return (
    <div ref={rootRef}>
      <button
        onClick={() =>
          setOpen(prev => !prev)
        }
      >
        {value?.label ?? "Select"}
      </button>

      {open && (
        <ul>
          {options.map(option => (
            <li key={option.id}>
              <button
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Then add:

- focus management
- arrow keys
- Escape
- Enter
- Home/End
- ARIA attributes
- controlled/uncontrolled support
- disabled items
- searchable mode
- positioning

This is an excellent React exercise for you because you already know how the behavior works in vanilla JavaScript.

---

# 56. Building a Tree: Vanilla JS vs React

Your existing tree component is another perfect learning bridge.

State could look like:

```js
const [expandedIds, setExpandedIds] =
  useState(new Set());
```

Render recursively:

```jsx
function TreeNode({ node }) {
  return (
    <li>
      <button>
        {node.name}
      </button>

      {node.children?.length > 0 && (
        <ul>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
```

Later add:

- expanded state
- selected state
- checkbox selection
- indeterminate state
- keyboard navigation
- drag and drop
- lazy-loaded child nodes
- virtualization
- search highlighting

This project can take you from beginner React to advanced React.

---

# 57. Advanced Component API Design

Because you already built frontend UI libraries, learn these patterns carefully.

## Controlled API

```jsx
<Dropdown
  value={selected}
  onChange={setSelected}
/>
```

## Uncontrolled API

```jsx
<Dropdown
  defaultValue={initialValue}
/>
```

## Compound Components

```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Trigger value="profile">
      Profile
    </Tabs.Trigger>

    <Tabs.Trigger value="security">
      Security
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="profile">
    ...
  </Tabs.Content>
</Tabs>
```

## Render Props

```jsx
<DataLoader>
  {({ data, loading }) => (
    ...
  )}
</DataLoader>
```

Less common in new code than hooks, but still important to recognize.

## Custom hooks

```jsx
const dropdown = useDropdown();
```

## Headless Components

Separate:

```text
behavior
from
visual styles
```

Useful for design systems.

---

# 58. Accessibility

A production React developer must understand accessibility.

For interactive components learn:

- semantic HTML
- keyboard navigation
- focus management
- `aria-expanded`
- `aria-controls`
- `aria-selected`
- `aria-activedescendant`
- labels
- dialogs
- listbox pattern
- menu pattern
- combobox pattern
- tree pattern

React does not automatically make custom components accessible.

If your component replaces a native browser control, you inherit responsibility for its behavior.

---

# 59. CSS in React

Your existing CSS knowledge remains useful.

Options:

```text
Normal CSS
CSS Modules
Tailwind CSS
CSS-in-JS
component libraries
```

Simple import:

```jsx
import "./Button.css";
```

CSS modules:

```jsx
import styles from "./Button.module.css";

<button className={styles.button}>
```

Tailwind:

```jsx
<button
  className="
    px-4 py-2
    rounded-lg
    bg-black
    text-white
  "
>
```

React does not replace CSS.

---

# 60. Global State Libraries

Do not immediately install Redux just because you're using React.

Start with:

```text
props
useState
Context
useReducer
```

Then learn one external store.

Good modern choices include:

- Zustand
- Redux Toolkit

Understand what problem you're solving:

```text
client global state
```

Examples:

- editor state
- multi-page wizard
- application preferences
- complex shared UI state
- collaborative local models

Remote server data is often better handled by a server-state library.

---

# 61. Server State vs Client State

## Client state

Examples:

```text
modal open
theme
selected tab
sidebar collapsed
current editor selection
draft filters
```

## Server state

Examples:

```text
users from API
orders
products
notifications
database records
```

Server state has extra concerns:

- caching
- freshness
- retries
- mutations
- refetching
- invalidation
- synchronization

This is why libraries such as TanStack Query exist.

---

# 62. TanStack Query Concepts

After basic React fetching, learn:

```text
query
query key
query function
cache
stale time
refetch
mutation
invalidate query
optimistic update
pagination
infinite query
```

Concept:

```jsx
const {
  data,
  isLoading,
  error
} = useQuery({
  queryKey: ["users"],
  queryFn: getUsers
});
```

Mutation:

```jsx
const mutation = useMutation({
  mutationFn: createUser
});
```

Then invalidate:

```jsx
queryClient.invalidateQueries({
  queryKey: ["users"]
});
```

---

# 63. TypeScript with React

After you are comfortable with React itself, add TypeScript.

Component props:

```tsx
type ButtonProps = {
  text: string;
  disabled?: boolean;
};

function Button({
  text,
  disabled = false
}: ButtonProps) {
  return (
    <button disabled={disabled}>
      {text}
    </button>
  );
}
```

Events:

```tsx
function handleChange(
  e: React.ChangeEvent<HTMLInputElement>
) {}
```

State:

```tsx
type User = {
  id: number;
  name: string;
};

const [user, setUser] =
  useState<User | null>(null);
```

Refs:

```tsx
const inputRef =
  useRef<HTMLInputElement | null>(null);
```

Since you already know programming well, TypeScript should eventually become your default for larger React projects.

---

# 64. Testing

Learn three levels.

## Unit tests

Pure logic:

```text
reducers
utility functions
formatters
validators
```

## Component tests

Example:

```text
render LoginForm
type email
type password
click login
expect request/UI state
```

Tools commonly used:

- Vitest
- React Testing Library

## End-to-end tests

Real browser behavior:

- login
- create record
- navigation
- payment flow
- permissions

Tools:

- Playwright
- Cypress

Prefer testing user-visible behavior instead of component implementation details.

---

# 65. React DevTools

Install React Developer Tools.

Learn to inspect:

- component hierarchy
- props
- state
- context
- re-renders
- profiler

If a component behaves incorrectly, inspect its actual state before adding random `console.log()` calls everywhere.

---

# 66. Folder Architecture

Small app:

```text
src/
├── components/
├── pages/
├── hooks/
├── services/
└── utils/
```

Larger app can be feature-oriented:

```text
src/
├── app/
│   ├── router/
│   └── providers/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── utils/
│   │
│   ├── users/
│   └── projects/
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── utils/
│   └── api/
│
└── main.jsx
```

Avoid one huge:

```text
components/
```

folder containing 200 unrelated files.

---

# 67. Separation of Concerns

Avoid:

```jsx
function UsersPage() {
  // 700 lines
  // fetch
  // filters
  // sorting
  // modal
  // forms
  // table
  // validation
  // permissions
}
```

Separate:

```text
UsersPage
├── useUsersQuery
├── UsersToolbar
├── UsersFilters
├── UsersTable
├── CreateUserDialog
└── EditUserDialog
```

But also avoid overengineering:

```text
ButtonTextWrapperContainerProvider
```

for a component used once.

The goal is readable boundaries.

---

# 68. React 19 Concepts

After mastering core React, learn newer React APIs.

Current React 19.x includes concepts around:

- Actions
- form actions
- `useActionState`
- `useOptimistic`
- `use`
- `useFormStatus`
- improved refs
- transitions
- Activity
- View Transitions
- Fragment refs
- server rendering improvements

Do not start here.

Start with:

```text
components
props
state
effects
refs
context
reducers
```

Then learn the newer APIs.

---

# 69. Actions

Actions help represent asynchronous mutations with pending/error/optimistic UI patterns.

Conceptually:

```text
User submits form
      ↓
async mutation starts
      ↓
pending state
      ↓
success/error
      ↓
UI updates
```

Before React-specific Actions, make sure you understand this manually.

---

# 70. `useOptimistic`

Used for optimistic updates.

Concept:

```text
Real state:
comments = [...]

Temporary optimistic state:
comments = [..., newPendingComment]
```

If server succeeds:

```text
confirmed
```

If server fails:

```text
revert
```

This is useful for:

- comments
- likes
- deletes
- reordering
- messaging
- toggles

---

# 71. `useTransition`

Use transitions for updates that can be lower priority.

Example concept:

```text
Typing in input:
urgent

Updating massive filtered list:
less urgent
```

Example:

```jsx
const [
  isPending,
  startTransition
] = useTransition();

function handleChange(value) {
  setInput(value);

  startTransition(() => {
    setSearch(value);
  });
}
```

You should first understand normal state updates before using transitions.

---

# 72. `useDeferredValue`

Allows a value to lag behind an urgent value.

Useful conceptually for:

```text
input updates immediately
large result view updates slightly later
```

Example:

```jsx
const deferredQuery =
  useDeferredValue(query);
```

Then expensive UI can use:

```jsx
deferredQuery
```

instead of the immediate value.

---

# 73. View Transitions

Modern React 19.3 includes stable View Transition support.

Use this later for:

- page-like transitions
- cards expanding into detail views
- shared-element animations
- smooth layout changes

Do not treat this as core beginner React.

It is an enhancement after your UI architecture is already solid.

---

# 74. Fragment Refs

React 19.3 can work with refs to Fragment groups.

This can help with DOM operations on groups of children without adding unnecessary wrapper elements.

Again, this is advanced.

You do not need it for normal React development.

---

# 75. React Server Components

Learn this **after** client-side React.

Server Components are a different execution model.

Conceptually:

```text
Server Component
- runs on server
- can access server resources
- sends rendered result

Client Component
- runs in browser
- can use state
- can handle browser events
```

Frameworks such as Next.js expose this architecture.

Do not mix the mental models too early.

Master client React first.

---

# 76. Vanilla JS → React Cheat Sheet

| Vanilla JavaScript | React |
|---|---|
| `document.createElement()` | JSX |
| `element.textContent = x` | `{x}` |
| `appendChild()` | component nesting |
| `querySelector()` | usually unnecessary; refs when needed |
| `addEventListener()` | `onClick`, `onChange`, etc. |
| mutable UI variable | `useState` |
| manual DOM update | state change + render |
| shared parent controller | lifted state |
| custom event bus | props/context/store |
| DOM reference | `useRef` |
| init/destroy listener | `useEffect` + cleanup |
| rendering a repeated array | `.map()` + `key` |
| manual show/hide | conditional rendering |
| class toggling | conditional `className` |
| template function | component |
| function configuration args | props |
| nested content parameter | `children` |
| global config object | Context |
| central state machine | `useReducer` |
| reusable behavior module | custom hook |
| manual mount/unmount | conditional component tree |
| manual lazy script load | `lazy()` + `Suspense` |
| manual overlay node | portal |
| DOM lifecycle cleanup | effect cleanup |
| cached calculation | `useMemo` |
| stable callback reference | `useCallback` |
| manual async cache | TanStack Query / framework data layer |

---

# 77. What You Should NOT Do in React

Avoid these habits from imperative DOM code.

## 1. Constantly query the DOM

Bad:

```js
document.querySelector(...)
```

Use data/state and refs.

## 2. Manually modify React-owned DOM

Bad:

```js
element.innerHTML = ...
```

Render JSX instead.

## 3. Duplicate state

Bad:

```text
items
filteredItems state
completedItems state
itemCount state
```

Derive values where possible.

## 4. Put everything in Context

Context is not automatically the correct answer.

## 5. Put everything in `useEffect`

Most application logic should not be effect-driven.

## 6. Install Redux before understanding state

Learn React state architecture first.

## 7. Premature optimization

Do not add:

```text
memo
useMemo
useCallback
```

everywhere.

## 8. Giant components

Split by meaningful responsibility.

## 9. Tiny meaningless components

Do not split every `<div>` into a component.

---

# 78. Learning Projects and Exercises

The exercises below are intentionally ordered by difficulty.

Do them in sequence.

---

# LEVEL 1 — JSX and Components

## Task 1: Profile Card

Build:

```text
ProfileCard
```

Props:

```text
name
jobTitle
avatarUrl
location
```

Requirements:

- JSX
- props
- normal CSS
- no state

Bonus:

- support `children`
- reusable `Badge` component

---

## Task 2: Product Card

Props:

```text
name
price
oldPrice
image
inStock
rating
```

Display:

- sale price
- discount percentage
- conditional "Out of stock"

Goal:

- expressions
- conditional rendering
- component extraction

---

## Task 3: Reusable Button System

Build:

```jsx
<Button variant="primary">
<Button variant="secondary">
<Button variant="danger">
```

Support:

```text
disabled
loading
icon
children
onClick
```

Goal:

- props
- composition
- className logic

---

# LEVEL 2 — State

## Task 4: Counter

Features:

```text
increment
decrement
reset
custom step
```

Requirements:

- `useState`
- functional state updates

---

## Task 5: Show/Hide Password

Features:

```text
password input
show/hide button
```

Goal:

- state
- events
- conditional attributes

---

## Task 6: Accordion

Requirements:

- list of sections
- only one open section
- opening another closes previous
- controlled state in parent

Bonus:

- allow multiple open sections

---

# LEVEL 3 — Lists

## Task 7: Todo List

Features:

```text
add
delete
toggle completed
edit
filter
```

Filters:

```text
all
active
completed
```

Requirements:

- array state
- immutable updates
- stable keys
- derived filtered list

Do not store `filteredTodos` separately.

---

## Task 8: Searchable User List

Use local mock data.

Features:

```text
search
sort A-Z / Z-A
role filter
active/inactive filter
```

Goal:

- derived state
- multiple filter conditions

Bonus:

- debounce search

---

# LEVEL 4 — Forms

## Task 9: Registration Form

Fields:

```text
name
email
password
confirm password
country
terms checkbox
```

Validation:

```text
required
valid email
password >= 8 chars
passwords match
terms accepted
```

Display field errors.

Do not use a form library yet.

---

## Task 10: Dynamic Form

Build a form where user can add/remove:

```text
phone numbers
```

Example:

```text
Phone 1 [........] remove
Phone 2 [........] remove

+ Add phone
```

Goal:

- nested array state
- immutable updates

---

# LEVEL 5 — Component Architecture

## Task 11: Modal Component

API:

```jsx
<Modal
  open={open}
  onClose={handleClose}
>
  ...
</Modal>
```

Requirements:

- portal
- Escape closes
- clicking backdrop closes
- clicking modal body does not close
- focus behavior
- body scroll handling

Bonus:

- focus trap

---

## Task 12: Dropdown

Rebuild the dropdown component you previously created in vanilla JS.

Requirements:

- controlled value
- `onChange`
- open/close
- outside click
- Escape closes
- arrow navigation
- Enter selects
- disabled options
- keyboard focus
- accessibility attributes

This should become your first serious React component.

---

# LEVEL 6 — Effects and Browser APIs

## Task 13: Window Size Hook

Build:

```js
useWindowSize()
```

Return:

```js
{
  width,
  height
}
```

Requirements:

- `useEffect`
- resize event
- cleanup

---

## Task 14: `useLocalStorage`

API:

```js
const [value, setValue] =
  useLocalStorage("key", initialValue);
```

Requirements:

- initial read
- JSON serialization
- update localStorage
- handle invalid JSON

---

## Task 15: Theme System

Features:

```text
light
dark
system
```

Persist choice.

React parts:

- state
- effects
- localStorage
- `matchMedia`
- Context

---

# LEVEL 7 — APIs

## Task 16: Users API Page

Use a public test API or your own backend.

States:

```text
loading
error
empty
success
```

Features:

```text
load users
refresh
retry
```

---

## Task 17: User Details

Routes:

```text
/users
/users/:id
```

Requirements:

- routing
- URL param
- request by ID
- loading/error state
- back navigation

---

## Task 18: Search API

Requirements:

```text
search input
debounce
cancel old request
loading state
no results
request error
```

Important:

Implement request cancellation with:

```text
AbortController
```

---

# LEVEL 8 — Refs and Advanced UI

## Task 19: Auto-Resizing Textarea

Requirements:

- textarea grows with content
- use ref
- no external library

---

## Task 20: Tooltip

Requirements:

- portal
- refs
- hover/focus
- calculate target position
- update on resize/scroll

Bonus:

- flip when insufficient viewport space

---

## Task 21: Context Menu

Right click an item.

Show:

```text
Rename
Duplicate
Delete
```

Requirements:

- portal
- mouse coordinates
- outside click
- Escape
- keyboard support

---

# LEVEL 9 — Recursive UI

## Task 22: File Tree

Data:

```js
{
  id: 1,
  name: "src",
  type: "folder",
  children: [...]
}
```

Features:

```text
expand/collapse
file/folder icons
selected node
recursive rendering
```

---

## Task 23: Advanced Tree

Add:

```text
multi-select
checkboxes
indeterminate checkboxes
keyboard navigation
rename
delete
create child
drag-and-drop
```

Bonus:

- lazy-load children
- virtualize large trees

This is a very strong portfolio project because it shows deep component architecture.

---

# LEVEL 10 — Reducers

## Task 24: Shopping Cart Reducer

Actions:

```text
ADD_ITEM
REMOVE_ITEM
SET_QUANTITY
CLEAR_CART
APPLY_COUPON
```

Use:

```text
useReducer
```

Derived values:

```text
subtotal
discount
total
item count
```

Do not store derived totals in state.

---

## Task 25: Kanban Board

Columns:

```text
Todo
In Progress
Done
```

Features:

```text
create card
edit
delete
move
drag and drop
filter
```

Use:

```text
useReducer
```

Bonus:

- undo/redo

---

# LEVEL 11 — Context

## Task 26: Authentication Context

Implement fake authentication.

Context provides:

```js
{
  user,
  login,
  logout,
  loading
}
```

Requirements:

- protected routes
- redirect after login
- persist session

---

## Task 27: Permissions System

User:

```js
{
  permissions: [
    "users.view",
    "users.create",
    "users.delete"
  ]
}
```

Build:

```jsx
<Can permission="users.delete">
  <DeleteButton />
</Can>
```

Also create:

```js
useCan(permission)
```

---

# LEVEL 12 — Custom Hooks

## Task 28: `useDebounce`

API:

```js
const debouncedValue =
  useDebounce(value, 500);
```

---

## Task 29: `useOutsideClick`

API:

```js
useOutsideClick(ref, onOutsideClick);
```

Use it in:

- dropdown
- modal
- context menu

---

## Task 30: `useFetch`

Build your own educational fetching hook:

```js
const {
  data,
  loading,
  error,
  refetch
} = useFetch(url);
```

Include:

- aborting requests
- dependency changes
- stale result protection

Then later compare this with TanStack Query and understand why production libraries are valuable.

---

# LEVEL 13 — Router Application

## Task 31: Admin Dashboard

Routes:

```text
/login

/dashboard

/users
/users/new
/users/:id
/users/:id/edit

/projects
/projects/:id

/settings
```

Requirements:

- nested layout
- breadcrumbs
- protected routes
- 404
- search params
- navigation sidebar

---

# LEVEL 14 — Server State

## Task 32: Convert Dashboard to TanStack Query

Replace manual fetching.

Implement:

```text
users query
user details query
create mutation
edit mutation
delete mutation
cache invalidation
optimistic delete
```

Observe how server-state code becomes easier to manage.

---

# LEVEL 15 — Performance

## Task 33: Large Search List

Generate:

```text
50,000 records
```

Features:

```text
search
filter
sort
```

Use React DevTools Profiler.

Test:

- normal implementation
- memoization
- deferred value
- virtualization

Document what actually improves performance.

---

# LEVEL 16 — Testing

## Task 34: Test Todo App

Write tests for:

```text
add todo
delete todo
toggle todo
filter
edit
```

Use:

```text
Vitest
React Testing Library
```

---

## Task 35: Test Login Flow

Test:

```text
empty validation
invalid credentials
loading
successful login
redirect
```

Then create one Playwright end-to-end test.

---

# LEVEL 17 — TypeScript

## Task 36: Convert Existing App

Convert your admin dashboard from:

```text
.jsx
.js
```

to:

```text
.tsx
.ts
```

Type:

- props
- API responses
- hooks
- context
- reducers
- events
- refs

Avoid:

```ts
any
```

unless genuinely necessary.

---

# LEVEL 18 — UI Library Project

## Task 37: Build Your Own React UI Library

Since you already created UI primitives in JavaScript, rebuild them in React.

Components:

```text
Button
Input
Textarea
Checkbox
Radio
Switch
Dropdown
Select
Combobox
Modal
Popover
Tooltip
Tabs
Accordion
Tree
ContextMenu
Toast
Table
Pagination
```

Requirements:

- accessibility
- controlled/uncontrolled support
- TypeScript
- reusable styling
- composition
- keyboard navigation
- tests

This project will teach you more than dozens of tutorials.

---

# LEVEL 19 — Advanced State Architecture

## Task 38: Complex Editor

Build something like:

```text
page builder
form builder
diagram editor
workflow editor
```

State contains:

```text
nodes
selection
history
layout
properties
clipboard
undo
redo
```

Start with:

```text
useReducer
```

Then optionally migrate to:

```text
Zustand
```

Compare the architectures.

---

# LEVEL 20 — Final Production Project

## Task 39: Full SaaS Admin Application

Build a realistic application.

Suggested domain:

```text
Project Management System
```

Pages:

```text
Login
Dashboard
Projects
Project Details
Tasks
Users
Teams
Activity
Settings
```

Features:

```text
authentication
permissions
routing
CRUD
forms
search
filters
sorting
pagination
modals
dropdowns
toasts
optimistic UI
loading skeletons
error handling
responsive design
dark mode
API integration
query caching
tests
TypeScript
```

Architecture:

```text
React
TypeScript
React Router
TanStack Query
Tailwind/CSS
Zustand only if needed
React Hook Form if useful
Zod for schemas/validation
Vitest
React Testing Library
Playwright
```

Do not choose every library automatically.

Use each library only after understanding the underlying React problem it solves.

---

# 79. Final Challenge — Build Your Own Mini Component Framework

This is specifically suitable for your background.

Build:

```text
React UI Kit
```

with:

```text
Dropdown
Combobox
Tree
Modal
Tabs
Data Table
Form fields
Toast system
```

For each component provide:

```text
1. controlled API
2. uncontrolled API
3. keyboard navigation
4. accessibility
5. TypeScript types
6. tests
7. examples
8. documentation
```

Then compare each React implementation to your old vanilla JavaScript implementation.

For every component write:

```text
Vanilla implementation required:
- DOM creation
- manual updates
- listener setup
- listener cleanup
- state variables
- synchronization

React implementation required:
- declarative JSX
- state
- props
- refs
- effects only for external synchronization
```

This comparison will make React click very quickly.

---

# 80. Suggested 8-Week Study Plan

This assumes you already know JavaScript very well.

## Week 1

Learn:

```text
JSX
components
props
children
events
useState
conditional rendering
lists
keys
```

Build:

```text
Profile Card
Counter
Accordion
Todo
```

---

## Week 2

Learn:

```text
forms
state architecture
lifting state
controlled components
derived state
composition
```

Build:

```text
registration form
search/filter list
modal
dropdown
```

---

## Week 3

Learn:

```text
useEffect
cleanup
useRef
browser APIs
fetch
race conditions
custom hooks
```

Build:

```text
API users page
useLocalStorage
useDebounce
useOutsideClick
tooltip
```

---

## Week 4

Learn:

```text
Context
useReducer
Context + reducer
routing
authentication UI
permissions
```

Build:

```text
shopping cart
auth system
permissions
admin routes
```

---

## Week 5

Learn:

```text
TanStack Query
mutations
cache
optimistic updates
loading/error architecture
```

Build:

```text
CRUD admin app
```

---

## Week 6

Learn:

```text
performance
memo
useMemo
useCallback
transitions
deferred values
lazy loading
Suspense
```

Build:

```text
large searchable dataset
code-split routes
```

---

## Week 7

Learn:

```text
TypeScript
testing
accessibility
advanced component patterns
```

Build:

```text
React UI component library
```

---

## Week 8

Build the final project.

Requirements:

```text
TypeScript
routing
API
authentication
permissions
forms
query caching
optimistic UI
responsive UI
tests
production deployment
```

---

# 81. Knowledge Checklist

You are comfortable with React when you can explain these without tutorials.

## Fundamentals

- [ ] What is JSX?
- [ ] What is a component?
- [ ] What are props?
- [ ] What is `children`?
- [ ] What causes a component to render?
- [ ] What is state?
- [ ] Why should state not be mutated?
- [ ] What is state as a snapshot?
- [ ] Why do list items need keys?
- [ ] Why are index keys dangerous?

## Architecture

- [ ] Where should state live?
- [ ] What is lifting state?
- [ ] Controlled vs uncontrolled?
- [ ] What is derived state?
- [ ] What is single source of truth?
- [ ] Props vs Context?
- [ ] `useState` vs `useReducer`?
- [ ] Context vs external store?

## Effects

- [ ] What is an effect?
- [ ] When should I not use an effect?
- [ ] What is effect cleanup?
- [ ] What are dependencies?
- [ ] How can stale closures happen?
- [ ] How do request race conditions happen?

## Refs

- [ ] State vs ref?
- [ ] How do I access a DOM element?
- [ ] When should a ref not be used?
- [ ] Why doesn't updating a ref re-render?

## Advanced

- [ ] What is reconciliation?
- [ ] Render vs commit?
- [ ] How is state preserved/reset?
- [ ] What does `memo` do?
- [ ] `useMemo` vs `useCallback`?
- [ ] What is Suspense?
- [ ] What is lazy loading?
- [ ] What is a transition?
- [ ] What is optimistic UI?
- [ ] What is server state?

## Production

- [ ] Routing
- [ ] Authentication
- [ ] Authorization/permissions
- [ ] API architecture
- [ ] Loading/error/empty states
- [ ] Query caching
- [ ] Mutations
- [ ] Forms
- [ ] Validation
- [ ] Accessibility
- [ ] Testing
- [ ] TypeScript
- [ ] Performance profiling
- [ ] Deployment

---

# 82. What to Learn After React

Once React itself feels natural:

```text
React
 ↓
TypeScript
 ↓
React Router
 ↓
TanStack Query
 ↓
Testing
 ↓
Next.js
```

If your goal is modern full-stack development:

```text
React
TypeScript
Next.js
server/client component model
authentication
PostgreSQL
API/server actions
caching
deployment
```

But learning Next.js before understanding React can hide important React fundamentals.

---

# 83. Recommended Practice Rule

For every topic:

```text
20% reading
80% coding
```

After learning a concept, close the tutorial and rebuild it yourself.

If you cannot rebuild it without copying, you do not fully know it yet.

---

# 84. The Best Way for You Specifically

Because you already know JavaScript and have built your own UI widgets, do not spend weeks watching beginner courses.

Your fastest path is:

```text
1. Learn core React mental model.
2. Rebuild components you already know.
3. Compare vanilla JS vs React implementation.
4. Build an admin CRUD app.
5. Add routing/API/query state.
6. Add TypeScript.
7. Build your own React UI kit.
8. Build one production-sized project.
```

The biggest learning point will not be JavaScript syntax.

It will be learning:

```text
declarative UI
state ownership
component boundaries
React rendering
effects
state synchronization
composition
server vs client state
```

---

# 85. Golden Rules

Remember these:

```text
1. UI is a function of state.

2. Change state, not the DOM.

3. Props flow downward.

4. Events flow upward through callbacks.

5. Keep one source of truth.

6. Derive values instead of duplicating state.

7. Use effects only for synchronization with external systems.

8. Treat state as immutable.

9. Keep components pure during rendering.

10. Start simple. Add Context/store/memoization only when the problem actually exists.
```

---

# 86. Your First Sequence of Tasks

Start here, in exactly this order:

```text
1. Counter
2. Accordion
3. Todo List
4. Search + Filter List
5. Registration Form
6. Modal
7. Dropdown
8. useLocalStorage
9. API Users Page
10. User Details + Router
11. Advanced Tree
12. Shopping Cart with useReducer
13. Authentication Context
14. Admin Dashboard
15. Convert Dashboard to TanStack Query
16. Convert Dashboard to TypeScript
17. Add tests
18. Build React UI Library
19. Build final SaaS project
```

Do not skip the Dropdown and Tree exercises.

Because you already implemented similar components in vanilla JavaScript, they will give you the clearest possible understanding of what React changes and what remains ordinary JavaScript.

---

# 87. Official References

Use these as your primary React references:

- React Learn: https://react.dev/learn
- React API Reference: https://react.dev/reference/react
- React Blog: https://react.dev/blog
- React 19.3 release: https://react.dev/blog/2026/09/09/react-19-3

For external libraries, prefer their official documentation.

---

# Final Goal

You are ready to call yourself comfortable with React when you can start from an empty Vite project and build this without following a tutorial:

```text
Authenticated admin application
├── Login
├── Protected routes
├── Permissions
├── Dashboard
├── CRUD pages
├── Search
├── Filters
├── Sort
├── Pagination
├── Forms
├── Modals
├── Dropdowns
├── Tree component
├── API caching
├── Optimistic updates
├── Loading/error states
├── TypeScript
├── Component tests
└── Responsive UI
```

At that point, React will no longer feel like a library you are "learning."

It will feel like your normal way of structuring frontend applications.
