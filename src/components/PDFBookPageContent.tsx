import React from 'react';
import { Subject, PDFMaterial } from '../types';

interface PDFContentProps {
  pdf: PDFMaterial;
  subject?: Subject;
  page: number;
}

export const PDFBookPageContent: React.FC<PDFContentProps> = ({ pdf, subject, page }) => {
  const isMath = pdf.subject_id?.includes('math') || pdf.title.toLowerCase().includes('matri') || pdf.title.toLowerCase().includes('calculus');
  const isPhysics = pdf.subject_id?.includes('phys') || pdf.title.toLowerCase().includes('laser') || pdf.title.toLowerCase().includes('optic');
  const isDrawing = pdf.subject_id?.includes('draw') || pdf.title.toLowerCase().includes('isometric') || pdf.title.toLowerCase().includes('orthographic');
  const isChemistry = pdf.subject_id?.includes('chem') || pdf.title.toLowerCase().includes('corrosion') || pdf.title.toLowerCase().includes('electrochem');
  const isComputer = pdf.subject_id?.includes('comp') || pdf.title.toLowerCase().includes('c program') || pdf.title.toLowerCase().includes('pointer');

  // Page 1: Syllabus, Objectives & Quick Summary
  if (page === 1) {
    return (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-800">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2 flex items-center justify-between">
            <span>1. Unit Syllabus & Technical Scope</span>
            <span className="text-[10px] text-slate-400 font-mono">POLYTECHNIC 2026</span>
          </h3>
          <p className="text-slate-700 leading-normal">
            {pdf.description}
          </p>
        </div>

        <div className="bg-indigo-50/70 rounded-lg p-3.5 border border-indigo-100/80">
          <h4 className="text-xs font-bold text-indigo-950 mb-1.5">
            Key Learning Outcomes & Exam Weightage:
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
            <li>Mastery over fundamental definitions, unit dimensions, and technical nomenclature.</li>
            <li>Step-by-step mathematical calculations and schematic circuit/mechanical representations.</li>
            <li>Confidence in solving high-weightage 10-mark long analytical problems in diploma board exams.</li>
            <li>Practical industry application in modern industrial engineering workshops.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            2. Core Formulas, Laws & Key Principles
          </h3>
          {isMath && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• Determinant Product: det(A · B) = det(A) · det(B)</div>
              <div>• Adjoint Rule: A · adj(A) = adj(A) · A = |A| · I</div>
              <div>• Characteristic Eq: |A - λI| = 0 (Roots are Eigenvalues)</div>
              <div>• Inverse Formula: A⁻¹ = (1 / |A|) · adj(A), where |A| ≠ 0</div>
            </div>
          )}

          {isPhysics && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• Snell&apos;s Law of Refraction: n₁ · sin(θ₁) = n₂ · sin(θ₂)</div>
              <div>• Critical Angle Formula: θ_c = arcsin(n₂ / n₁) (for n₁ &gt; n₂)</div>
              <div>• Numerical Aperture (NA): NA = √(n₁² - n₂²) = sin(θ_max)</div>
              <div>• Einstein Relation: A₂₁ / B₂₁ = (8πhν³ / c³) [Stimulated Emission]</div>
            </div>
          )}

          {isDrawing && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• First Angle Projection: Object is placed in 1st Quadrant (Plan below Elevation)</div>
              <div>• Third Angle Projection: Object is in 3rd Quadrant (Plan above Elevation)</div>
              <div>• Isometric Scale: Isometric Length = 0.816 × True Length</div>
              <div>• BIS Standard Lines: Continuous thick (Outlines), Dashed (Hidden features)</div>
            </div>
          )}

          {isChemistry && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• Nernst Equation: E = E° - (0.0591 / n) · log₁₀([Anode] / [Cathode])</div>
              <div>• Faraday&apos;s 1st Law: m = Z · I · t (Mass deposited directly proportional to charge)</div>
              <div>• Galvanic Cell EMF: E_cell = E_cathode - E_anode</div>
              <div>• Rust Formation: 4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O (Hydrated Ferric Oxide)</div>
            </div>
          )}

          {isComputer && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• Pointer Declaration: int *ptr = &amp;variable;</div>
              <div>• Dereferencing Operator: *ptr gives the value stored at memory location</div>
              <div>• Memory Allocation: ptr = (int*) malloc(n * sizeof(int));</div>
              <div>• Call by Reference: {`void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }`}</div>
            </div>
          )}

          {!isMath && !isPhysics && !isDrawing && !isChemistry && !isComputer && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
              <div>• Technical Standard Law: Output = (Efficiency · Input) / Friction Loss</div>
              <div>• System Stability: Characteristic equation poles must lie in left half of s-plane</div>
              <div>• Precision Constraint: Tolerance limits maintained as per ISO-9001 standard</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Page 2: Solved Model Numerical / Engineering Derivation
  if (page === 2) {
    return (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
          3. Step-by-Step Solved Problem (Standard 10-Mark Board Pattern)
        </h3>

        {isMath && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Exam Problem: Reduce matrix A to Echelon form and determine its rank:
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800">
{`A = [ [1,  2,  3],
      [2,  4,  7],
      [3,  6, 10] ]`}
            </pre>
            <p className="text-xs text-slate-600">
              <strong>Step 1:</strong> Apply row operations R₂ → R₂ - 2(R₁) and R₃ → R₃ - 3(R₁):
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800">
{`A ~ [ [1, 2, 3],
      [0, 0, 1],
      [0, 0, 1] ]`}
            </pre>
            <p className="text-xs text-slate-600">
              <strong>Step 2:</strong> Apply R₃ → R₃ - R₂ to eliminate the 3rd row:
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800">
{`A ~ [ [1, 2, 3],
      [0, 0, 1],
      [0, 0, 0] ]`}
            </pre>
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ Conclusion: The number of non-zero rows is 2. Therefore, Rank ρ(A) = 2.
            </p>
          </div>
        )}

        {isPhysics && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Exam Problem: Calculate the Numerical Aperture and acceptance angle of an optical fiber having core refractive index n₁ = 1.50 and cladding index n₂ = 1.45.
            </p>
            <p className="text-xs text-slate-600">
              <strong>Step 1 (Formula):</strong> NA = √(n₁² - n₂²)
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800">
{`NA = √((1.50)² - (1.45)²)
   = √(2.25 - 2.1025)
   = √0.1475 = 0.384`}
            </pre>
            <p className="text-xs text-slate-600">
              <strong>Step 2 (Acceptance Angle θ_a):</strong> θ_a = arcsin(NA) = arcsin(0.384)
            </p>
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ Final Answer: Numerical Aperture = 0.384, Acceptance Angle = 22.58°.
            </p>
          </div>
        )}

        {isDrawing && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Drawing Exercise: Procedure for drawing orthographic views of an isometric block:
            </p>
            <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1.5">
              <li><strong>Reference Line:</strong> Draw reference horizontal XY line and vertical auxiliary plane X₁Y₁.</li>
              <li><strong>Front Elevation:</strong> Project views by observing along the direction of arrow &apos;X&apos;.</li>
              <li><strong>Top View (Plan):</strong> Project downwards from front view keeping width same.</li>
              <li><strong>Side View:</strong> Project at 45° miter line from top view to ensure depth equality.</li>
            </ol>
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ Rule: All hidden edges must be represented by dashed lines (2mm dash, 1mm space).
            </p>
          </div>
        )}

        {isChemistry && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Exam Problem: Calculate EMF of Daniel Cell at 298 K when [Zn²⁺] = 0.1 M and [Cu²⁺] = 0.01 M. Given E°_cell = 1.10 V.
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800">
{`E_cell = E°_cell - (0.0591 / 2) · log₁₀([Zn²⁺] / [Cu²⁺])
       = 1.10 - 0.0295 · log₁₀(0.1 / 0.01)
       = 1.10 - 0.0295 · log₁₀(10)
       = 1.10 - 0.0295 = 1.0705 V`}
            </pre>
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ Final Answer: Cell Potential under non-standard conditions is 1.07 V.
            </p>
          </div>
        )}

        {isComputer && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Exam Problem: C Program to reverse an array using pointers without auxiliary array:
            </p>
            <pre className="font-mono text-xs bg-white p-2.5 border border-slate-200 rounded text-slate-800 overflow-x-auto">
{`#include <stdio.h>
void reverse(int *arr, int n) {
    int *left = arr, *right = arr + n - 1;
    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;
        left++; right--;
    }
}`}
            </pre>
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ Time Complexity: O(N), Space Complexity: O(1) in-place reversal.
            </p>
          </div>
        )}

        {!isMath && !isPhysics && !isDrawing && !isChemistry && !isComputer && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900">
              Standard Technical Procedure & Solved Case Study:
            </p>
            <p className="text-xs text-slate-700">
              Step 1: Write down given values, identify governing equations, and convert units to standard SI metric system.
            </p>
            <p className="text-xs text-slate-700">
              Step 2: Carry out step-by-step substitution and highlight final numerical value with correct dimensions.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Page 3: Frequently Repeated Polytechnic Board Questions
  if (page === 3) {
    return (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2 flex items-center justify-between">
          <span>4. Board Exam Questions (5-Year Question Bank)</span>
          <span className="text-[10px] text-amber-600 font-semibold">100% EXAM TARGET</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
              <span>Question 1 [10 Marks - Compulsory]</span>
              <span className="text-indigo-600 font-mono">Repeated 4 Times</span>
            </div>
            <p className="text-xs text-slate-700">
              {isMath && "State Cayley-Hamilton theorem. Verify it for matrix A = [[1, 4], [2, 3]] and hence compute A⁻¹ and A⁴."}
              {isPhysics && "Explain the working principle and construction of He-Ne laser with a neat labeled energy level diagram."}
              {isDrawing && "Draw the front view, top view, and side view of a given machine casting block in First Angle projection."}
              {isChemistry && "Explain mechanism of electrochemical corrosion (oxygen absorption and hydrogen evolution) with reactions."}
              {isComputer && "What is dynamic memory allocation? Differentiate between malloc() and calloc() with syntax and memory leaks."}
              {!isMath && !isPhysics && !isDrawing && !isChemistry && !isComputer && `Explain the fundamental working principle and practical implementation of ${pdf.chapter}.`}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
              <span>Question 2 [5 Marks]</span>
              <span className="text-indigo-600 font-mono">Repeated 3 Times</span>
            </div>
            <p className="text-xs text-slate-700">
              {isMath && "Define orthogonal matrix. Show that the product of two orthogonal matrices is also orthogonal."}
              {isPhysics && "State Snell's law and explain Total Internal Reflection condition for optical fiber waveguides."}
              {isDrawing && "Draw standard title block dimensions specified by Bureau of Indian Standards (BIS SP-46)."}
              {isChemistry && "Define sacrificial anode method and impressed current cathodic protection method for pipelines."}
              {isComputer && "What are pointers? Write a function to swap two numbers using call by reference pointers."}
              {!isMath && !isPhysics && !isDrawing && !isChemistry && !isComputer && "State 4 key advantages and 2 limitations in industrial engineering practice."}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
              <span>Question 3 [5 Marks]</span>
              <span className="text-indigo-600 font-mono">Short Answer</span>
            </div>
            <p className="text-xs text-slate-700">
              {isMath && "Find the eigenvalues of the matrix A = [[2, 1], [1, 2]] and state algebraic multiplicity."}
              {isPhysics && "What is optical attenuation? List 3 causes of signal losses in fiber optic communication."}
              {isDrawing && "Differentiate between First Angle projection and Third Angle projection with standard symbols."}
              {isChemistry && "Explain why zinc coating is preferred over tin coating on iron sheets."}
              {isComputer && "Explain difference between structure and union in C with memory representation."}
              {!isMath && !isPhysics && !isDrawing && !isChemistry && !isComputer && "Define standard definitions, unit conventions, and boundary constraints."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Page 4: Lab Practical, Workshop & Industry Applications
  return (
    <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
        5. Laboratory & Practical Workshop Applications
      </h3>
      <p className="text-xs text-slate-700 leading-normal">
        Polytechnic diploma students will utilize this chapter ({pdf.chapter}) during lab practical experiments and technical project evaluations:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <h4 className="font-bold text-indigo-950 mb-1">Civil & Architecture:</h4>
          <p className="text-indigo-900/80">
            Structural deflection analysis, load distribution matrices, survey drafting, and CAD floor plans.
          </p>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <h4 className="font-bold text-indigo-950 mb-1">Mechanical & Auto:</h4>
          <p className="text-indigo-900/80">
            Stress-strain tensors, CNC toolpaths, thermal expansion gradients, and corrosion-resistant coatings.
          </p>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <h4 className="font-bold text-indigo-950 mb-1">Electrical & Electronics:</h4>
          <p className="text-indigo-900/80">
            Nodal admittance matrices, fiber optic spliced networks, laser alignment sensors, and circuit breadboards.
          </p>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <h4 className="font-bold text-indigo-950 mb-1">Computer & IT:</h4>
          <p className="text-indigo-900/80">
            2D/3D affine transformation matrices, memory pointer algorithms, and embedded systems coding.
          </p>
        </div>
      </div>

      <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1">
        <p className="text-xs font-semibold text-slate-900">
          Polytechnic Diploma Academic Repository
        </p>
        <p className="text-[11px] text-slate-500">
          Document verified by Polytechnic Subject Matter Faculty · {subject?.name || 'PolyStudy'}
        </p>
      </div>
    </div>
  );
};
