# 📘 Sample Mini-Course Example
## "Creating Custom Parameters in Revit Families"

### Purpose of This Example

This sample mini-course demonstrates how to apply all AMD platform principles in practice. Use this as a reference when designing your own courses.

**Topic:** Revit Family Parameters  
**Duration:** 1 module (approximately 3 hours of content + 2 hours practice)  
**Skill Level:** Intermediate  
**Prerequisites:** Basic Revit knowledge, familiar with family editor

---

## 📚 Module Overview

### Module Title
**Module 3: Mastering Parametric Design with Custom Parameters**

### Overview
In this module, you'll unlock the power of parametric modeling by creating intelligent, flexible Revit families controlled by custom parameters. You'll learn to add Type and Instance parameters, write conditional formulas, and create families that automatically adapt to different scenarios—saving hours of manual modeling time in real projects.

### Why This Module Matters
Parametric families are what separate basic Revit users from BIM power users. In professional practice, you'll be expected to create families that are flexible, reusable, and intelligent. This skill directly impacts project efficiency: a well-designed parametric family can be used across hundreds of projects, while a rigid family needs to be rebuilt every time. Mastering parameters is also the foundation for advanced topics like Dynamo automation and adaptive components.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:

1. **Create and configure** custom Type and Instance parameters in Revit families with appropriate data types and groupings
2. **Write conditional formulas** using IF statements and mathematical operators to control family geometry automatically
3. **Build parametric families** with nested components and visibility controls that adapt to user selections
4. **Troubleshoot common parameter issues** including circular dependencies, incorrect data types, and formula errors

---

## 🔧 Skills Gained

After completing this module, you will have mastered:

- ✅ Adding Type parameters to control family-wide properties
- ✅ Adding Instance parameters for element-specific variations
- ✅ Writing formulas with arithmetic operators (+, -, *, /)
- ✅ Using IF statements for conditional logic
- ✅ Creating Yes/No parameters for visibility control
- ✅ Organizing parameters into logical groups
- ✅ Testing and validating parameter behavior
- ✅ Identifying and fixing parameter errors
- ✅ Applying parameter best practices and naming conventions

---

## 📖 Module Content

### Lesson 3.1: Parameter Types and When to Use Them
**⏱️ Duration:** 8 minutes  
**Type:** Video Lesson

**Lesson Objective:**
By the end of this lesson, you will be able to distinguish between Type and Instance parameters and select the appropriate parameter type based on design intent.

**Key Concepts:**
- Type Parameters: Same value for all instances of a family type
- Instance Parameters: Unique value for each placed element
- Decision framework: "Will this vary per element, or per type?"
- Real-world examples of each parameter type

**Lesson Outline:**

**[0:00-0:45] INTRO - The Power of Parameters**
- VISUAL: Impressive parametric family example (door that auto-adjusts)
- AUDIO: "Imagine creating one door family that automatically adjusts its frame thickness, swing direction, and hardware placement based on simple dropdown selections. That's the power of parameters, and today you'll learn how to build this intelligence into your families."

**[0:45-1:15] Learning Objective**
- VISUAL: On-screen text with objective
- AUDIO: "By the end of this lesson, you'll be able to choose between Type and Instance parameters with confidence, understanding exactly when to use each one."

**[1:15-5:00] MAIN CONTENT**

*Section 1: What Are Parameters? (1:30)*
- VISUAL: Split screen - left shows parameter definition, right shows Revit family
- AUDIO: "Think of parameters as variables in programming, or fields in a database. They store values that control your family's behavior. When you change a parameter value, the family responds automatically. For example, when I change the 'Width' parameter from 36 inches to 30 inches..." [demonstrates family width changing]
- KEY POINTS:
  - Parameters store values (numbers, text, yes/no, materials)
  - Values drive family geometry and behavior
  - Changes propagate automatically

*Section 2: Type vs Instance Parameters (2:30)*
- VISUAL: Side-by-side comparison diagram, then live Revit demo
- AUDIO: "Here's the critical distinction: Type parameters apply to ALL instances of a specific type. If I have five '36x80 Single Doors' in my project, they all share the same Type parameter values. But Instance parameters can be different for every single door I place."

**[5:00-7:00] PRACTICAL EXAMPLE**
- VISUAL: Building a simple door family with both parameter types
- AUDIO: "Let's make this concrete. I'm creating a simple door family. The frame thickness should be a Type parameter because all doors of the '2-hour fire-rated' type have the same frame thickness. But the door swing direction should be an Instance parameter because Door #101 swings left while Door #102 swings right, even though they're both the same type."
- DEMO: Show adding both parameters and testing behavior

**[7:00-7:45] CONCLUSION**
- VISUAL: Quick reference table summarizing differences
- AUDIO: "Remember: Type parameters are for properties shared by all instances of a type, like wall thickness or material. Instance parameters are for properties that vary per element, like elevation or swing direction. In the next lesson, we'll actually create these parameters ourselves."

**[7:45-8:00] END CARD**
- VISUAL: Preview of next lesson + "Pause and try" prompt
- AUDIO: "Before moving on, pause and think about a family you've worked with recently. Which parameters should be Type, and which should be Instance? See you in the next lesson!"

---

**Resources for Lesson 3.1:**
- 📄 Video Transcript (downloadable)
- 📄 Lesson Summary: Type vs Instance Parameters (1-page PDF)
- 📊 Decision Tree Diagram: "Which Parameter Type Should I Use?"
- 📝 Practice Exercise: Parameter Type Classification (5-minute activity)

---

### Lesson 3.2: Creating Your First Custom Parameter
**⏱️ Duration:** 12 minutes  
**Type:** Video Tutorial (Follow-Along)

**Lesson Objective:**
By the end of this lesson, you will be able to add custom Type and Instance parameters to a Revit family with appropriate data types and default values.

**Key Concepts:**
- Accessing the Family Types dialog
- Parameter naming conventions
- Data types (Length, Integer, Yes/No, Text, etc.)
- Parameter groups for organization
- Setting default values

**Lesson Outline:**

**[0:00-1:00] INTRO & OBJECTIVE**
- Hook: "What you'll build"
- Statement of what learners will create

**[1:00-9:30] STEP-BY-STEP DEMONSTRATION**

*Part 1: Accessing Parameter Dialog (1:30)*
- Open family editor
- Navigate to Family Types button
- Explain interface layout

*Part 2: Creating Type Parameter (3:00)*
- Click "New Parameter"
- Name: "Frame_Thickness" (explain naming convention)
- Select "Type" radio button
- Choose data type: "Length"
- Assign to group: "Construction"
- Set default value: 1.5 inches
- Click OK
- Show parameter in list

*Part 3: Creating Instance Parameter (3:00)*
- Repeat process for "Swing_Direction"
- Select "Instance" radio button
- Choose data type: "Text"
- Group: "Identity Data"
- Default value: "Left"
- Demonstrate difference in Properties panel after loading

*Part 4: Testing Parameters (2:00)*
- Load family into project
- Place instance
- Show Type Properties vs Instance Properties
- Modify values and observe behavior

**[9:30-11:30] COMMON MISTAKES & TIPS**
- ⚠️ Don't use spaces in parameter names (use underscores)
- ⚠️ Wrong data type = formula errors later
- 💡 Use clear, descriptive names (not "Size" or "Value")
- 💡 Organize into groups for team collaboration
- 💡 Always test after creating parameters

**[11:30-12:00] CONCLUSION & NEXT STEPS**
- Recap key steps
- Preview next lesson: "Writing Formulas"
- "Pause and practice" prompt

---

**Resources for Lesson 3.2:**
- 📄 Video Transcript
- 📄 Step-by-Step Checklist: Creating Parameters
- 📥 Practice Family Template (RFA file)
- 📝 Parameter Naming Conventions Guide (PDF)

---

### Lesson 3.3: Writing Formulas for Automatic Calculations
**⏱️ Duration:** 14 minutes  
**Type:** Video Tutorial

**Lesson Objective:**
By the end of this lesson, you will be able to write parameter formulas using arithmetic operators and functions to create self-calculating families.

**Key Concepts:**
- Formula syntax in Revit
- Arithmetic operators: +, -, *, /
- Referencing other parameters in formulas
- Order of operations (PEMDAS)
- Common formula patterns

**Lesson Outline:**

**[0:00-1:00] INTRO**
- Show impressive example: family that auto-calculates total height based on components
- "Formulas are where parameters become truly powerful"

**[1:00-11:00] FORMULA CREATION DEMONSTRATION**

*Part 1: Basic Arithmetic (2:30)*
- Example: Overall Width = Frame_Thickness * 2 + Door_Width
- Syntax: Type parameter name in value field
- Test formula by changing inputs

*Part 2: Division and Centering (2:30)*
- Example: Center_Offset = Overall_Width / 2
- Use case: Centering geometry on reference plane

*Part 3: Complex Formulas (3:00)*
- Combining multiple operations
- Example: Total_Height = Base_Height + Top_Trim + (Number_of_Panels * Panel_Height)
- Order of operations with parentheses

*Part 4: Common Formula Patterns (3:00)*
- Doubling: Frame_Total = Frame_Thickness * 2
- Percentage: Reduced_Size = Original_Size * 0.85
- Offset calculation: End_Point = Start_Point + Length

**[11:00-13:00] TROUBLESHOOTING**
- Error: "Formula contains a reference to itself" (circular dependency)
- Solution: Check parameter chain, break cycle
- Error: "Incompatible units"
- Solution: Ensure consistent data types
- Testing formulas: Change inputs, verify outputs

**[13:00-14:00] CONCLUSION**

---

**Resources for Lesson 3.3:**
- 📄 Video Transcript
- 📄 Formula Cheat Sheet (common patterns)
- 📥 Formula Practice Family (RFA)
- 📊 Formula Troubleshooting Flowchart

---

### Lesson 3.4: Conditional Logic with IF Statements
**⏱️ Duration:** 15 minutes  
**Type:** Video Tutorial (Advanced)

**Lesson Objective:**
By the end of this lesson, you will be able to write IF statement formulas to create adaptive families that change behavior based on conditions.

**Key Concepts:**
- IF statement syntax: IF(condition, value_if_true, value_if_false)
- Comparison operators: =, <, >, <=, >=, <>
- Logical operators: AND, OR, NOT
- Yes/No parameters for visibility control
- Nested IF statements

**Lesson Outline:**

**[0:00-1:30] INTRO**
- Example: Door hardware that appears only if door width > 36"
- "Make families smart enough to make decisions"

**[1:30-12:00] IF STATEMENT TUTORIAL**

*Part 1: Basic IF Syntax (3:00)*
- Formula: IF(Door_Width > 36", 1, 0)
- Explanation: If door width exceeds 36 inches, return 1 (true), otherwise 0 (false)
- Use case: Controlling visibility

*Part 2: Visibility Parameters (3:30)*
- Create Yes/No parameter: "Show_Hardware"
- Formula: Show_Hardware = IF(Door_Width >= 36", 1, 0)
- Link parameter to component visibility
- Test: Change width, observe hardware appearing/disappearing

*Part 3: Conditional Sizing (2:30)*
- Formula: Frame_Thickness = IF(Fire_Rated = "Yes", 2", 1.5")
- Multiple conditions for different scenarios

*Part 4: AND/OR Logic (3:00)*
- Formula: Show_ADA_Hardware = IF(AND(Width >= 32", Is_Exterior = 1), 1, 0)
- Combining multiple conditions
- When to use AND vs OR

**[12:00-14:00] REAL-WORLD EXAMPLE**
- Build a door family that:
  - Shows double hardware if width > 60" (pair of doors)
  - Shows fire rating label if Fire_Rated = Yes
  - Adjusts frame automatically based on wall thickness

**[14:00-15:00] CONCLUSION**

---

**Resources for Lesson 3.4:**
- 📄 Video Transcript
- 📄 IF Statement Syntax Guide
- 📥 Conditional Family Examples (3 RFA files)
- 📝 Challenge Exercise: Build Smart Light Fixture

---

### Lesson 3.5: Best Practices and Common Pitfalls
**⏱️ Duration:** 10 minutes  
**Type:** Video Lesson

**Lesson Objective:**
By the end of this lesson, you will be able to apply professional best practices for parameter design and troubleshoot common errors.

**Key Concepts:**
- Parameter naming conventions (industry standards)
- Documentation and comments
- Testing methodology
- Performance considerations
- Team collaboration practices

**Lesson Outline:**

**[0:00-1:00] INTRO**

**[1:00-7:00] BEST PRACTICES**

*Naming Conventions (1:30)*
- Use descriptive names: Door_Width not DW
- Use underscores, not spaces
- Prefix for categories: DIM_Width, MAT_Frame, VIS_ShowHardware
- Consistent capitalization

*Organization (1:30)*
- Group related parameters
- Use logical parameter groups
- Order parameters in Properties panel

*Documentation (1:30)*
- Add comments to complex formulas
- Create parameter description documents
- Maintain version history

*Testing Protocol (1:30)*
- Test all parameter combinations
- Verify formulas with extreme values
- Load into project and test in context
- Check performance with many instances

*Team Collaboration (1:00)*
- Shared parameter files for consistency
- Standard templates
- Parameter libraries

**[7:00-9:00] COMMON PITFALLS**

1. **Circular Dependencies**
   - Symptom: "Formula contains reference to itself"
   - Cause: A = B, B = C, C = A
   - Solution: Break the loop

2. **Incorrect Data Types**
   - Symptom: Formula fails or unexpected results
   - Cause: Mixing Length and Number types
   - Solution: Convert units properly

3. **Overly Complex Formulas**
   - Symptom: Hard to debug, slow performance
   - Cause: Trying to do too much in one formula
   - Solution: Break into intermediate parameters

4. **Not Testing Edge Cases**
   - Symptom: Family breaks with certain values
   - Cause: Only tested typical values
   - Solution: Test minimum, maximum, zero, negative

**[9:00-10:00] CONCLUSION & CHECKLIST**

---

**Resources for Lesson 3.5:**
- 📄 Video Transcript
- 📄 Parameter Best Practices Checklist (PDF)
- 📄 Troubleshooting Decision Tree
- 📄 Naming Convention Standards Guide

---

## 🛠️ Hands-On Lab 3.1: Build a Parametric Cabinet Family

**⏱️ Estimated Time:** 45 minutes

### 🎯 Objective
By completing this lab, you will be able to create a fully parametric cabinet family with custom parameters controlling dimensions, materials, and component visibility.

### 📋 Prerequisites
- Completed Lessons 3.1-3.4
- Revit installed
- Basic family editor knowledge

### 📦 Materials Needed
- 📥 Lab 3.1 Starter Template (Generic Model family)
- 📥 Reference Image: Cabinet Design Sketch
- 📄 Parameter Specification Sheet

### 🔧 Tools Used
- Revit Family Editor
- Extrusion tool
- Reference planes
- Parameters and formulas

---

### 📝 Instructions

**Part 1: Setup (10 minutes)**

1. Download the starter template: `Lab-3.1-Cabinet-Starter.rfa`
2. Open in Revit Family Editor
3. Save as: `YourName_Cabinet_Parametric.rfa`
4. Review the existing reference planes (Width, Depth, Height)

**Part 2: Create Base Parameters (10 minutes)**

1. Open Family Types dialog (Modify tab → Family Types button)

2. Create the following **Type Parameters:**
   
   | Parameter Name | Data Type | Group | Default Value |
   |----------------|-----------|-------|---------------|
   | Cabinet_Width | Length | Dimensions | 36" |
   | Cabinet_Depth | Length | Dimensions | 24" |
   | Cabinet_Height | Length | Dimensions | 30" |
   | Shelf_Thickness | Length | Materials | 0.75" |
   | Door_Thickness | Length | Materials | 0.75" |

3. Create the following **Instance Parameters:**
   
   | Parameter Name | Data Type | Group | Default Value |
   |----------------|-----------|-------|---------------|
   | Number_of_Shelves | Integer | Dimensions | 2 |
   | Has_Doors | Yes/No | Visibility | Yes (checked) |

4. **Checkpoint:** You should now have 7 custom parameters visible in the Family Types dialog

**Part 3: Build Base Geometry (10 minutes)**

1. **Create Cabinet Box:**
   - Select Create → Extrusion
   - Draw rectangle from 0,0 to Width reference plane, Depth reference plane
   - Set extrusion height: Lock to Cabinet_Height parameter
   - Set material: Wood
   - Name this extrusion: "Cabinet_Box"

2. **Create Bottom Shelf:**
   - Create extrusion at base
   - Dimensions: Width × Depth × Shelf_Thickness
   - Lock to parameters:
     - Width dimension → Cabinet_Width
     - Depth dimension → Cabinet_Depth
     - Thickness → Shelf_Thickness
   
   💡 **Tip:** Use the padlock icon to lock dimensions to parameters

3. **Test Your Work:**
   - Change Cabinet_Width to 48"
   - Verify geometry updates automatically
   - Change back to 36"

**Part 4: Add Formulas for Automatic Calculations (10 minutes)**

1. Create new Type Parameter: `Shelf_Spacing`
   - Data Type: Length
   - Formula: `Shelf_Spacing = (Cabinet_Height - Shelf_Thickness) / (Number_of_Shelves + 1)`
   - This automatically calculates even spacing based on number of shelves

2. Create new Type Parameter: `Door_Width`
   - Data Type: Length  
   - Formula: `Door_Width = Cabinet_Width / 2 - 0.125"`
   - This creates two doors with 1/4" gap between

3. Create new Type Parameter: `Usable_Interior_Height`
   - Data Type: Length
   - Formula: `Usable_Interior_Height = Cabinet_Height - (Shelf_Thickness * 2)`
   - Calculates interior space (subtracts top and bottom)

   ⚠️ **Common Mistake:** Forgetting parentheses in formulas with multiple operations

4. **Test Formulas:**
   - Change Number_of_Shelves to 3
   - Observe Shelf_Spacing updating automatically
   - Change Cabinet_Width to 48"
   - Verify Door_Width adjusts (should be ~23.875")

**Part 5: Add Conditional Visibility (5 minutes)**

1. Create door geometry (simple extrusion):
   - Dimensions: Door_Width × Door_Thickness × (Cabinet_Height - 2")
   - Position: Front of cabinet
   - Name: "Cabinet_Door"

2. Set visibility control:
   - Select the door extrusion
   - Properties panel → Visible parameter
   - Check the box, select parameter: `Has_Doors`

3. **Test:**
   - Load family into project
   - Place instance
   - In Properties panel, toggle Has_Doors
   - Doors should appear/disappear

**Part 6: Testing & Validation (10 minutes)**

1. **Test Parameter Combinations:**
   - Cabinet_Width: 24", 36", 48", 60"
   - Cabinet_Height: 24", 30", 36"
   - Number_of_Shelves: 1, 2, 3, 4
   - Has_Doors: Yes, No

2. **Quality Checks:**
   - No warning messages in Revit
   - All dimensions respond to parameters
   - Formulas calculate correctly
   - Doors appear/disappear as expected
   - Geometry doesn't overlap or gap

3. **Create Family Types:**
   - In Family Types dialog, create 3 types:
     - "Base Cabinet 36x24x30"
     - "Base Cabinet 48x24x30"
     - "Tall Cabinet 24x24x72" (adjust height)

---

### ✅ Success Criteria

Check off each requirement:

- [ ] All 7 custom parameters created with correct data types
- [ ] Cabinet box geometry updates when Width/Depth/Height changed
- [ ] Shelf_Spacing formula calculates correctly
- [ ] Door_Width formula creates properly sized doors
- [ ] Doors appear when Has_Doors = Yes, disappear when No
- [ ] Family loads into project without errors
- [ ] Can switch between family types successfully
- [ ] No warning or error messages in Revit

---

### 🎓 Bonus Challenges (Optional)

If you finish early or want extra practice:

- [ ] **Challenge 1:** Add a "Cabinet_Material" parameter (Material type) and link it to all geometry
- [ ] **Challenge 2:** Create multiple shelves using an array, with spacing controlled by Shelf_Spacing parameter
- [ ] **Challenge 3:** Add drawer geometry that appears only when "Has_Drawers" = Yes
- [ ] **Challenge 4:** Add a "Is_Corner_Cabinet" parameter that changes depth automatically (48" if corner, 24" if standard)

---

### 📸 Submission

Upload to the course platform:

1. **Your RFA file** - Named: `YourName_Cabinet_Parametric.rfa`
2. **Screenshot** showing:
   - Family Types dialog with all parameters visible
   - 3D view of cabinet with parameters labeled
3. **Brief reflection** (3-5 sentences):
   - What was most challenging?
   - What are you most proud of?
   - How would you use parametric cabinets in a real project?

---

## 🎨 Module Project: Build a Parametric Furniture Family

**⏱️ Estimated Time:** 2-3 hours  
**Difficulty:** Intermediate

### Project Scenario

**Client:** Modern Office Interiors, Inc.  
**Your Role:** BIM Content Developer  

**Scenario:**
Modern Office Interiors has hired you to create a flexible furniture family for their product catalog. They manufacture custom office desks in various sizes and configurations, and they need a Revit family that can adapt to any client specification without rebuilding from scratch.

Your task is to create a parametric office desk family that automatically adjusts dimensions, includes configurable features (keyboard tray, drawers), and maintains professional quality regardless of size variations.

### 🎯 Project Objectives

This project integrates skills from all lessons in Module 3:
- Lesson 3.1: Type vs Instance parameters
- Lesson 3.2: Creating custom parameters
- Lesson 3.3: Writing formulas
- Lesson 3.4: Conditional logic (IF statements)
- Lesson 3.5: Best practices

---

### 📋 Project Requirements

**Minimum Requirements (Must Complete):**

1. **Dimension Parameters** (Type Parameters)
   - [ ] Desk_Length (60" default, range: 48"-84")
   - [ ] Desk_Width (30" default, range: 24"-42")
   - [ ] Desk_Height (29" default, range: 28"-32")
   - [ ] Top_Thickness (1.5" default)
   - [ ] Leg_Thickness (3" default)

2. **Feature Parameters** (Instance Parameters)
   - [ ] Has_Keyboard_Tray (Yes/No)
   - [ ] Number_of_Drawers (Integer: 0, 2, or 3)
   - [ ] Finish_Type (Text: "Laminate", "Veneer", or "Solid Wood")

3. **Calculated Parameters (Formulas)**
   - [ ] Keyboard_Tray_Width = Desk_Length - 6" (centered under desk)
   - [ ] Leg_Spacing = Desk_Length / 3 (evenly distribute legs)
   - [ ] Usable_Workspace = (Desk_Length - Leg_Thickness * 2) * (Desk_Width - 4")

4. **Conditional Visibility**
   - [ ] Keyboard tray appears only when Has_Keyboard_Tray = Yes
   - [ ] Drawer units appear based on Number_of_Drawers (0 = none, 2 = right side, 3 = right side pedestal)

5. **Quality Standards**
   - [ ] All geometry properly constrained to parameters
   - [ ] No errors or warnings when loading into project
   - [ ] Family works correctly at minimum and maximum dimensions
   - [ ] Parameters organized into logical groups (Dimensions, Features, Materials, Calculations)

**Bonus Features (Optional - Extra Credit):**

- [ ] **Bonus 1:** Add monitor arm mount that appears when Has_Monitor_Arm = Yes (5 points)
- [ ] **Bonus 2:** Create formula that adjusts leg thickness based on desk length (larger desk = thicker legs) (5 points)
- [ ] **Bonus 3:** Add material parameters for desk top vs leg materials (5 points)
- [ ] **Bonus 4:** Create 5 family types representing standard catalog sizes (5 points)

---

### 🗺️ Project Phases

**Phase 1: Planning & Setup (30 minutes)**
- Sketch desk design on paper
- List all parameters needed
- Decide which should be Type vs Instance
- Identify relationships between parameters
- Set up family template (Generic Model)

**Phase 2: Create Parameters & Base Geometry (60 minutes)**
- Create all required parameters
- Build desk top geometry
- Add legs with proper constraints
- Test dimension changes

**Phase 3: Add Formulas & Calculated Parameters (30 minutes)**
- Write formulas for auto-calculations
- Create derived parameters
- Test formula accuracy

**Phase 4: Conditional Features (45 minutes)**
- Model keyboard tray
- Model drawer units (3 variations)
- Set up visibility parameters
- Link visibility to Yes/No parameters
- Test all combinations

**Phase 5: Quality Control & Finalization (15 minutes)**
- Test all parameter combinations
- Verify no errors/warnings
- Create family types for common sizes
- Check professional appearance
- Organize parameters into groups

---

### 📊 Evaluation Rubric

| Criteria | Exemplary (4) | Proficient (3) | Developing (2) | Incomplete (1) |
|----------|---------------|----------------|----------------|----------------|
| **Parameter Creation** | All parameters created correctly with appropriate data types, names follow best practices, well-organized into groups | All required parameters present, mostly correct types and naming | Missing 1-2 parameters or several naming/type issues | Many parameters missing or incorrect |
| **Formula Accuracy** | All formulas calculate correctly across all value ranges, no errors | Formulas work for most cases, minor issues | Formulas have errors or don't work for some inputs | Formulas missing or fundamentally broken |
| **Conditional Visibility** | Keyboard tray and drawers appear/disappear perfectly based on parameters, smooth and professional | Visibility mostly works, minor glitches | Visibility partially functional | Visibility not working |
| **Geometry Quality** | Professional appearance, clean geometry, properly constrained, no gaps/overlaps | Good quality, minor cosmetic issues | Several geometry problems, constraints incomplete | Poor quality, geometry broken |
| **Testing & Robustness** | Works flawlessly at all dimension ranges and parameter combinations | Works well for most combinations, fails in edge cases | Works for basic cases, breaks in several scenarios | Frequent errors, family unstable |

**Total: ___/20 points**  
**Bonus: ___/20 points**  
**Passing Score: 15/20 (75%)**

---

### 💡 Tips & Resources

**Tips:**
1. **Start simple:** Build basic desk first, then add features incrementally
2. **Test frequently:** Don't wait until the end to test parameters
3. **Name clearly:** Future-you will thank present-you for good naming
4. **Use reference planes:** Lock geometry to planes, lock planes to parameters
5. **Save versions:** Save as Desk_v1, Desk_v2 as you add features

**Resources:**
- 📥 Desk Reference Sketches (PDF)
- 📥 Example Parametric Furniture Family (for inspiration, don't copy)
- 📄 Parameter Planning Worksheet (Excel)
- 🎥 Review: Lesson 3.3 - Writing Formulas

---

### 📸 Submission Instructions

**Submit the following:**

1. **Revit Family File (.rfa)**
   - Filename: `LastName_FirstName_ParametricDesk.rfa`
   - Must load without errors

2. **Screenshots (3 images minimum)**
   - Screenshot 1: Family Types dialog showing all parameters
   - Screenshot 2: 3D view with keyboard tray visible
   - Screenshot 3: 3D view with 3 drawers visible
   - (Optional) Screenshot 4: Family in project showing different types

3. **Project Reflection (PDF or text)**
   - **Planning Process:** How did you plan parameter relationships?
   - **Challenges:** What was most difficult? How did you solve it?
   - **Learning:** What's the most important thing you learned?
   - **Application:** How would you use parametric families in real projects?
   - **Next Steps:** What would you add to make this family even better?
   
   *(Aim for 2-3 paragraphs total, 300-500 words)*

**Submission Deadline:** End of Week [X]

---

## ✏️ Knowledge Check Quiz

**Quiz Type:** Formative Assessment  
**Questions:** 10  
**Time Limit:** None (untimed)  
**Passing Score:** 80%  
**Attempts Allowed:** Unlimited  

---

**Question 1:**

Which type of parameter should you use if you want all instances of "36x80 Door" to have the same frame thickness, but "30x80 Door" to have a different frame thickness?

A) Instance Parameter  
B) Type Parameter ✅  
C) Shared Parameter  
D) Global Parameter

**Correct Answer:** B

**Explanation:** Type Parameters are the same for all instances of a specific family type, but can differ between types. In this case, all "36x80 Doors" would share the same frame thickness value, but that value can be different from the "30x80 Door" type. Instance Parameters would vary for each individual door (like location), which is not what we want here. Shared Parameters are for scheduling purposes, and Global Parameters control multiple families across a project.

**Difficulty:** Easy  
**Bloom's Level:** Understand

---

**Question 2:**

What is the correct syntax for a formula that calculates total width as the sum of left margin, content width, and right margin?

A) Total_Width: Left_Margin + Content_Width + Right_Margin  
B) Total_Width = (Left_Margin, Content_Width, Right_Margin)  
C) Total_Width = Left_Margin + Content_Width + Right_Margin ✅  
D) Total_Width == Left_Margin + Content_Width + Right_Margin

**Correct Answer:** C

**Explanation:** In Revit, formulas use the equals sign (=) followed by the expression. You reference other parameter names directly and use arithmetic operators (+, -, *, /). Option A is missing the equals sign. Option B uses incorrect syntax with parentheses and commas. Option D uses double equals (==) which is for comparison, not assignment.

**Difficulty:** Easy  
**Bloom's Level:** Apply

---

**Question 3:**

You create a formula: `Frame_Width = Door_Width + Frame_Thickness * 2`

If Door_Width = 36" and Frame_Thickness = 1.5", what is the calculated Frame_Width?

A) 39" ✅  
B) 75"  
C) 37.5"  
D) 40"

**Correct Answer:** A

**Explanation:** Following order of operations (PEMDAS), multiplication happens before addition:
1. Frame_Thickness * 2 = 1.5" * 2 = 3"
2. Door_Width + 3" = 36" + 3" = 39"

Option B (75") would result from (36 + 1.5) * 2 if you incorrectly added first. Option C (37.5") is from 36 + 1.5 without multiplying. Option D (40") is a miscalculation.

**Difficulty:** Medium  
**Bloom's Level:** Apply

---

**Question 4:**

What does this formula do? `Show_Hardware = IF(Door_Width >= 36", 1, 0)`

A) Sets Door_Width to 36 inches if hardware is shown  
B) Makes hardware visible when door width is 36 inches or greater ✅  
C) Calculates the hardware size based on door width  
D) Displays an error if door width is less than 36 inches

**Correct Answer:** B

**Explanation:** This IF statement checks if Door_Width is greater than or equal to 36 inches. If true, it returns 1 (Yes/True), making the hardware visible. If false (door width less than 36"), it returns 0 (No/False), hiding the hardware. This is a common pattern for conditional visibility control in Revit families.

**Difficulty:** Medium  
**Bloom's Level:** Analyze

---

**Question 5 (Scenario-Based):**

**Scenario:** You're creating a parametric window family for a residential project. The family should automatically include a "Window Sill" component when the "Window_Type" parameter is set to "Exterior", but not when it's set to "Interior".

Which approach should you use?

A) Create an Instance parameter called "Show_Sill" and manually toggle it for each window  
B) Create a Type parameter with the formula: `Show_Sill = IF(Window_Type = "Exterior", 1, 0)` and link it to the sill's visibility ✅  
C) Create two separate families: one with sill, one without  
D) Use a global parameter to control all window sills in the project

**Correct Answer:** B

**Explanation:** Option B is the best solution because it automates the visibility based on the Window_Type parameter, so the sill automatically appears/disappears when you change the type. This is a Type parameter because all windows of a given type (e.g., "Exterior Casement") should behave the same way. Option A requires manual work for every window instance, which defeats the purpose of parametric design. Option C creates unnecessary duplicate families. Option D (global parameter) would affect all windows simultaneously, which isn't the desired behavior.

**Difficulty:** Hard  
**Bloom's Level:** Evaluate

---

**Question 6:**

Which parameter naming convention follows best practices?

A) width  
B) Door Width  
C) Door_Width ✅  
D) DOORWIDTH

**Correct Answer:** C

**Explanation:** Best practice is to use underscores instead of spaces (Revit allows spaces but they can cause issues), use descriptive names with capitalization for readability (Door_Width is clearer than "width"), and avoid all-caps which reduces readability. Option A is too generic. Option B has a space. Option D is all-caps and hard to read.

**Difficulty:** Easy  
**Bloom's Level:** Remember

---

**Question 7:**

You receive the error message: "This formula contains a circular reference."

What does this mean and how do you fix it?

A) The formula uses a circular shape - rewrite it with different geometry  
B) A parameter references itself directly or indirectly - break the dependency loop ✅  
C) The formula is too complex - simplify by removing parentheses  
D) You need to use a different data type for the parameter

**Correct Answer:** B

**Explanation:** A circular reference occurs when Parameter A depends on Parameter B, which depends on Parameter C, which depends back on Parameter A (creating a loop). Example: If Height = Width * 2, and Width = Height / 2, these reference each other and create a circular dependency. The fix is to break the loop by identifying the chain and making one parameter independent. This has nothing to do with geometry shapes, formula complexity in terms of parentheses, or data types.

**Difficulty:** Medium  
**Bloom's Level:** Analyze

---

**Question 8:**

What is the primary advantage of using formulas in parameters rather than manually calculating and entering values?

A) Formulas make the family file size smaller  
B) Formulas are easier to understand than numbers  
C) Values automatically update when input parameters change, maintaining relationships ✅  
D) Formulas are required for Revit certification

**Correct Answer:** C

**Explanation:** The key benefit of formulas is automation and maintaining design intent. When you change an input (like Door_Width), all dependent calculated parameters (like Frame_Width, Hardware_Position, etc.) update automatically, maintaining the design relationships. This saves time and prevents errors from manual recalculation. Option A is false (formulas don't significantly affect file size). Option B is debatable (a well-named number can be clear). Option D is irrelevant to the functional advantage.

**Difficulty:** Medium  
**Bloom's Level:** Understand

---

**Question 9:**

Which data type should you use for a parameter controlling whether to show or hide a family component?

A) Length  
B) Integer  
C) Text  
D) Yes/No ✅

**Correct Answer:** D

**Explanation:** Yes/No (Boolean) parameters are specifically designed for visibility control and true/false conditions. They store either 1 (Yes/True) or 0 (No/False). When linked to a component's Visible parameter, they show/hide that component. While you technically could use an Integer parameter with values 0 and 1, Yes/No is the proper, intuitive choice. Length and Text data types don't work for visibility control.

**Difficulty:** Easy  
**Bloom's Level:** Remember

---

**Question 10 (Scenario-Based):**

**Scenario:** You're building a parametric desk family. The desk should have reinforcement brackets if the desk length exceeds 72 inches, AND if the material is "Laminate" (not needed for "Solid Wood" which is naturally stronger).

Which formula correctly implements this logic?

A) `Show_Brackets = IF(Desk_Length > 72", 1, 0)`  
B) `Show_Brackets = IF(Material = "Laminate", 1, 0)`  
C) `Show_Brackets = IF(AND(Desk_Length > 72", Material = "Laminate"), 1, 0)` ✅  
D) `Show_Brackets = IF(OR(Desk_Length > 72", Material = "Laminate"), 1, 0)`

**Correct Answer:** C

**Explanation:** Both conditions must be true (length > 72" AND material is laminate), so we need the AND operator. Option A only checks length, missing the material requirement. Option B only checks material, missing the length requirement. Option D uses OR, which would show brackets if EITHER condition is true (wrong - we need BOTH). Only Option C correctly uses AND to require both conditions: the desk must be both longer than 72" AND made of laminate for brackets to appear.

**Difficulty:** Hard  
**Bloom's Level:** Evaluate

---

## 💬 Discussion Questions

**Post your responses in the course forum and engage with at least 2 peers' posts.**

1. **Application Question:**
   Describe a family you use frequently in your work that would benefit from parametric design. What parameters would you add, and how would they improve your workflow?

2. **Analysis Question:**
   Compare Type parameters and Instance parameters. In what project scenario would the wrong choice significantly impact team productivity? Provide a specific example.

3. **Reflection Question:**
   What was the most challenging part of creating parametric families for you? What strategy helped you overcome that challenge?

4. **Real-World Connection:**
   Share an example of a time when a non-parametric (rigid) family caused problems in a project. How could parameters have prevented that issue?

5. **Creative Question:**
   Imagine you're creating a furniture catalog for a manufacturer. How would you use parameter formulas to ensure design consistency across 100+ family variations (chairs, desks, tables)?

---

## 📚 Module Resources

### Downloadable Materials

**Lesson Resources:**
- 📄 All Video Transcripts (ZIP file)
- 📄 Module 3 Complete Notes (20-page PDF)
- 📊 Parameter Decision Tree Diagram
- 📝 Formula Cheat Sheet (Laminated reference card)

**Practice Files:**
- 📥 Lab 3.1 Starter Template (RFA)
- 📥 Project Desk Reference Sketches (PDF)
- 📥 Example Parametric Families (5 RFA files for study)
- 📥 Parameter Planning Worksheet (Excel)

**Reference Guides:**
- 📘 Revit Formula Syntax Complete Reference (PDF)
- 📘 Parameter Naming Convention Standards
- 📘 Troubleshooting Common Parameter Errors (Flowchart PDF)
- 📘 IF Statement Examples Library (10 scenarios)

**Templates:**
- 📝 Parameter Documentation Template (Word)
- 📝 Family Testing Checklist (PDF)
- 📝 Quality Control Review Form

### External Resources

**Recommended Reading:**
- Autodesk Help: "About Family Parameters" (Official documentation)
- Blog: "10 Formulas Every Revit User Should Know"
- Video Series: "Advanced Parametric Modeling" (LinkedIn Learning)

**Community Resources:**
- Revit Forum: Parameter Questions Thread
- Reddit: r/Revit Parametric Family Showcase
- Course Discussion Forum: Module 3

---

## 🔄 Module Summary & Reflection

### Key Takeaways

By completing Module 3, you've mastered:

✅ **Fundamental Understanding**
- Distinction between Type and Instance parameters
- When to use each parameter type based on design intent
- How parameters drive family behavior

✅ **Technical Skills**
- Creating custom parameters with appropriate data types
- Writing formulas using arithmetic operators
- Implementing conditional logic with IF statements
- Troubleshooting parameter errors and circular references

✅ **Professional Practices**
- Parameter naming conventions for team collaboration
- Organizing parameters into logical groups
- Testing methodology for robust families
- Documentation and version control

✅ **Real-World Application**
- Building parametric families that save project time
- Creating flexible, reusable family content
- Maintaining design intent across variations
- Professional-quality deliverables for portfolios

---

### Self-Assessment Checklist

**Before moving to Module 4, confirm you can:**

- [ ] Explain the difference between Type and Instance parameters to a colleague
- [ ] Create custom parameters without referring to notes
- [ ] Write formulas for automatic calculations confidently
- [ ] Use IF statements to control visibility and conditional behavior
- [ ] Troubleshoot common parameter errors independently
- [ ] Apply best practices for naming and organization
- [ ] Build a parametric family from scratch (like the lab and project)
- [ ] Test families thoroughly across all parameter ranges

**If you checked all items, you're ready for Module 4!**  
**If you're unsure about any, review those lessons or ask in the discussion forum.**

---

### Module Completion Requirements

- [ ] Watched all 5 lessons (total: 59 minutes)
- [ ] Completed Hands-On Lab 3.1 (45 minutes)
- [ ] Passed Knowledge Check Quiz with 80%+ (10 questions)
- [ ] Submitted Module Project: Parametric Desk (2-3 hours)
- [ ] Posted in discussion forum (at least 1 post + 2 replies)
- [ ] Completed self-assessment and reflection

**Estimated Total Time Spent:** _____ hours

---

### What's Next?

**Module 4: Advanced Family Techniques - Nesting and Shared Parameters**

**Preview:**
In the next module, you'll take parametric design to the next level by learning:
- How to nest families within families for complex assemblies
- Creating shared parameters for scheduling and data consistency
- Building adaptive families that respond to project geometry
- Integrating families into larger BIM workflows

**Get ready to build even more powerful, intelligent families!**

---

## 🎓 Reflection

Take a few minutes to reflect on your learning:

**1. Growth Mindset**
- How have your parametric design skills improved since starting this module?
- What concept that seemed difficult at first now makes sense?

**2. Application**
- Give a specific example of how you'll use custom parameters in your next project.
- What family will you rebuild parametrically?

**3. Challenges**
- What aspect of parameters is still challenging for you?
- What resources or practice will help you master it?

**4. Next Steps**
- What's one parameter technique you want to explore further?
- Who on your team could benefit from learning this skill?

---

**Congratulations on completing Module 3! You've unlocked one of Revit's most powerful capabilities. Keep practicing, and you'll soon be creating families that seem like magic to others—but are just smart parametric design to you.** 🎉

---

*Have questions or feedback about this module? Post in the discussion forum or email the instructor directly.*
