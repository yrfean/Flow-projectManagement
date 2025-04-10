import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useAllData, useCreateProject } from "../../Query/QueryAndMutation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const projectSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string(),
  priority: Yup.string()
    .oneOf(["low", "medium", "high", "urgent"])
    .required("Required"),
  dueDate: Yup.date().required("Required"),
  teamLead: Yup.string().required("Required"),
  members: Yup.array().of(Yup.string()),
  status: Yup.string()
    .oneOf(["incompleted", "completed", "pending"])
    .required("Required"),
});

const NewProjectInput = () => {
  const [inputPopup, setInputPopup] = useState(false);
  const { data } = useAllData();
  const newProjectMutate = useCreateProject();

  const allUsers = data?.allUsers || [];
  const allProjects = data?.allProjects || [];

  const assignedUserIds = useMemo(() => {
    const assigned = new Set<string>();
    allProjects.forEach((proj: any) => {
      if (proj.teamLead) assigned.add(proj.teamLead.toString());
      proj.members?.forEach((id: string) => assigned.add(id));
    });

    return [...assigned, "67f2e0562bd15b4490158116"];
  }, [allProjects]);

  const availableUsers = allUsers.filter(
    (user: any) => !assignedUserIds.includes(user._id)
  );

  return (
    <>
      {inputPopup ? (
        <div className="w-[488px] p-4 bg-gray-300 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-xl font-bold">New Project</h2>

          <Formik
            initialValues={{
              title: "",
              description: "",
              priority: "medium",
              dueDate: "",
              teamLead: "",
              members: [],
              status: "incompleted",
            }}
            validationSchema={projectSchema}
            onSubmit={(values) => {
              console.log("Project Created:", values);
              newProjectMutate.mutate(values);
              setInputPopup(false);
            }}
          >
            {({ values, errors, touched }) => (
              <Form className="space-y-3">
                <div>
                  <Field
                    name="title"
                    placeholder="Title"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm">{errors.title}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      as="select"
                      name="priority"
                      className="w-full border p-2 rounded-xl outline-none"
                    >
                      {["low", "medium", "high", "urgent"].map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <Field
                      as="select"
                      name="status"
                      className="w-full border p-2 rounded-xl outline-none"
                    >
                      {["incompleted", "completed", "pending"].map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Due date</label>
                  <Field
                    type="date"
                    name="dueDate"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                  {errors.dueDate && touched.dueDate && (
                    <div className="text-red-500 text-sm">{errors.dueDate}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Team Lead</label>
                  <Field
                    as="select"
                    name="teamLead"
                    className="w-full border p-2 rounded-xl outline-none"
                  >
                    <option value="">Select Team Lead</option>
                    {availableUsers.map((user: any) => (
                      <option key={user._id} value={user._id}>
                        {`${user.name}, ${user.role}`}
                      </option>
                    ))}
                  </Field>
                  {errors.teamLead && touched.teamLead && (
                    <div className="text-red-500 text-sm">
                      {errors.teamLead}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Members</label>
                  <Field
                    as="select"
                    name="members"
                    multiple
                    className="w-full border p-2 rounded-xl h-32 outline-none"
                  >
                    {availableUsers
                      .filter((user: any) => user._id !== values.teamLead)
                      .map((user: any) => (
                        <option
                          key={user._id}
                          value={user._id}
                          className="bg-gray-200 rounded cursor-pointer m-1"
                        >
                          {`${user.name}, ${user.role}`}
                        </option>
                      ))}
                  </Field>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl (or Cmd) to select multiple
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-violet-500 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputPopup(false)}
                    className="text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div
          onClick={() => setInputPopup(true)}
          className="min-w-[475px] outline-4 outline-dashed outline-gray-300  group min-h-[248px] h-full flex items-center justify-center hover:shadow-xl cursor-pointer bg-gray-200 hover:bg-gray-100 transition-all rounded shadow-lg"
        >
          <Plus className="size-12 text-gray-400 group-hover:text-gray-500 transition-all" />
        </div>
      )}
    </>
  );
};

export default NewProjectInput;
