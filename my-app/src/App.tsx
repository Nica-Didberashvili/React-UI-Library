import { useState } from "react";
import "./App.css";
import { Button } from "./Components/Button";
import { Input } from "./Components/Input";
import { Textarea } from "./Components/Textarea";
import { Checkbox } from "./Components/Checkbox";
import { Switch } from "./Components/Switch";
import { RadioGroup, Radio } from "./Components/Radio";
import { Modal } from "./Components/Modal";
import { Tabs, TabsList, TabsTrigger, TabsPanel } from "./Components/Tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "./Components/Accordion";
import { Dropdown } from "./Components/Dropdown";
import { Popover } from "./Components/Popover";
import { Tooltip } from "./Components/Tooltip";
import { Pagination } from "./Components/Pagination";
import { Select } from "./Components/Select";
import { Combobox } from "./Components/Combobox";
import { ContextMenu, ContextMenuItem } from "./Components/ContextMenu";
import { Tree } from "./Components/Tree";
import { Table } from "./Components/Table";
import { useToast } from "./Components/Toast";

export default function App() {
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(5);
  const [fruit, setFruit] = useState("banana");
  const { toast } = useToast();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-logo">UI</span>
            <div>
              <h1>React UI Library</h1>
              <p>Composable · Accessible · TypeScript</p>
            </div>
          </div>
          <div className="app-stats">
            <div className="stat">
              <strong>19</strong>
              <span>components</span>
            </div>
            <div className="stat">
              <strong>127</strong>
              <span>tests</span>
            </div>
            <div className="stat">
              <strong>0</strong>
              <span>a11y issues</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Section
          title="Form Controls"
          subtitle="Button, Input, Textarea, Checkbox, Switch, Radio"
        >
          <Field label="Button">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button variant="primary" onClick={() => alert("Clicked!")}>
                Primary
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Field>

          <Field label="Text Inputs">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              error="Email is required"
              placeholder="john@example.com"
            />
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </Field>

          <Field label="Checkbox & Switch">
            <Checkbox
              label="I agree to the terms"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <div className="row">
              <Switch label="Enable notifications" defaultChecked />
            </div>
            <div className="row">
              <Switch
                label="Dark mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <span className="muted">
                State: {darkMode ? "on" : "off"}
              </span>
            </div>
          </Field>

          <Field label="Radio Group">
            <RadioGroup defaultValue="apple">
              <div className="radio-list">
                <Radio value="apple" label="Apple" />
                <Radio value="banana" label="Banana" />
                <Radio value="cherry" label="Cherry" />
              </div>
            </RadioGroup>
          </Field>
        </Section>

        <Section
          title="Overlays"
          subtitle="Dropdown, Popover, Tooltip, Modal"
        >
          <Field label="Dropdown">
            <Dropdown
              options={[
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
                { value: "cherry", label: "Cherry", disabled: true },
                { value: "dragonfruit", label: "Dragonfruit" },
              ]}
              value={fruit}
              onValueChange={setFruit}
            />
            <p className="muted">Selected: {fruit}</p>
          </Field>

          <Field label="Popover">
            <Popover trigger="Open popover">
              <p style={{ margin: 0 }}>Popover content goes here.</p>
              <div style={{ marginTop: 8 }}>
                <Button variant="secondary" size="sm">
                  Action
                </Button>
              </div>
            </Popover>
          </Field>

          <Field label="Tooltip">
            <p>
              Hover over{" "}
              <Tooltip content="This is a helpful hint">
                <span className="dotted">this term</span>
              </Tooltip>{" "}
              to see a tooltip.
            </p>
          </Field>

          <Field label="Modal">
            <div>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </div>
            <Modal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Delete User"
            >
              <p>
                Are you sure you want to delete this user? This action cannot
                be undone.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 24,
                }}
              >
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    alert("Deleted!");
                    setIsModalOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Modal>
          </Field>

          <Field label="Select (Generic)">
            <Select
              options={[
                { value: 1, label: "One" },
                { value: 2, label: "Two" },
                { value: 3, label: "Three" },
              ]}
              defaultValue={1}
            />
          </Field>

          <Field label="Combobox">
            <Combobox 
              options={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue" },
                { value: "svelte", label: "Svelte" },
                { value: "angular", label: "Angular" },
              ]}
               placeholder="Search frameworks..."
            />
          </Field>

          <Field label="Context Menu">
            <ContextMenu
              menu={
                <>
                  <ContextMenuItem onClick={() => alert("Edit")}>Edit</ContextMenuItem>
                  <ContextMenuItem onClick={() => alert("Delete")}>Delete</ContextMenuItem>
                </>
              }
            >
              Right-click inside this box
            </ContextMenu>
          </Field>

          <Field label="Toast Notifications">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => toast({ title: 'Default Notifications'})}
              >
                Default
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast({ title: "Success!", variant: 'success' })}
              >
                Success
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast({ title: 'Error occurred', variant: 'error' })}
              >
                Error
              </Button>
            </div>
          </Field>
        </Section>

        <Section
          title="Navigation & Disclosure"
          subtitle="Tabs, Accordion, Pagination"
        >
          <Field label="Tabs">
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsPanel value="account">Account settings here.</TabsPanel>
              <TabsPanel value="password">Password settings here.</TabsPanel>
              <TabsPanel value="settings">Settings here.</TabsPanel>
            </Tabs>
          </Field>

          <Field label="Accordion">
            <Accordion type="single" defaultValue={["shipping"]}>
              <AccordionItem value="shipping">
                <AccordionTrigger>
                  Do you ship internationally?
                </AccordionTrigger>
                <AccordionPanel>
                  Yes, we ship to 40+ countries.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger>
                  What is your return policy?
                </AccordionTrigger>
                <AccordionPanel>
                  30 days, no questions asked.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="support">
                <AccordionTrigger>
                  How do I contact support?
                </AccordionTrigger>
                <AccordionPanel>
                  Email support@example.com.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Field>

          <Field label="Pagination">
            <Pagination page={page} totalPages={10} onPageChange={setPage} />
            <p className="muted">Current page: {page}</p>
          </Field>
        </Section>

        <Section
          title="Data Display"
          subtitle="Tree, Table"
        >
          <Field label="Tree">
            <Tree 
              defaultExpandedIds={["1"]}
              data={[
                {
                  id: "1",
                  label: "Documents",
                  children: [
                    { id: "1-1", label: "Resume.pdf" },
                    { id: "1-2", label: "CoverLetter.pdf" },
                  ],
                },
                { id: "2", label: "Pictures" },
              ]}
            />
          </Field>

          <Field label="Table">
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: "hidden" }}>
              <Table
                data={[
                  { id: "1", name: "Alice", role: "Engineer" },
                  { id: "2", name: "Bob", role: "Designer" },
                  { id: "3", name: "Charlie", role: "Manager" },
                ]}
                columns={[
                  { key: "name", header: "Name", render: (r: any) => r.name, sortable: true },
                  { key: "role", header: "Role", render: (r: any) => r.role },
                ]}
                keyExtractor={(r: any) => r.id}
              />
            </div>
          </Field>
        </Section>
      </main>

      <footer className="app-footer">
        Built with React, TypeScript, and Vitest.
      </footer>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <header className="section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      <div className="section-body">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <h3 className="field-label">{label}</h3>
      <div className="field-content">{children}</div>
    </div>
  );
}