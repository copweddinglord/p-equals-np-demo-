/**
 * NP-Complete Problem Definitions
 */

class ProblemGenerator {
  /**
   * Generate a Traveling Salesman Problem instance
   * @param {number} size - Number of cities
   * @returns {Object} TSP problem instance
   */
  static generateTSP(size) {
    const cities = [];
    
    // Generate cities in a circle with some randomness
    for (let i = 0; i < size; i++) {
      const angle = (i / size) * 2 * Math.PI;
      const radius = 100 + Math.random() * 20;
      cities.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }
    
    return {
      type: 'tsp',
      name: `Traveling Salesman Problem (${size} cities)`,
      size,
      cities,
      dimensions: 11
    };
  }
  
  /**
   * Generate a Graph Coloring Problem instance
   * @param {number} size - Number of nodes
   * @param {number} density - Edge density (0-1)
   * @returns {Object} Graph coloring problem instance
   */
  static generateGraphColoring(size, density = 0.3) {
    // Initialize empty graph
    const graph = Array(size).fill().map(() => Array(size).fill(0));
    
    // Add edges with given density
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        if (Math.random() < density) {
          graph[i][j] = 1;
          graph[j][i] = 1;
        }
      }
    }
    
    // Estimate maximum colors needed (upper bound)
    const maxColors = Math.min(size, Math.ceil(size * density * 2));
    
    return {
      type: 'graph-coloring',
      name: `Graph Coloring Problem (${size} nodes)`,
      size,
      graph,
      maxColors,
      dimensions: 11
    };
  }
  
  /**
   * Generate a Boolean Satisfiability (SAT) Problem instance
   * @param {number} variables - Number of variables
   * @param {number} clauses - Number of clauses
   * @returns {Object} SAT problem instance
   */
  static generateSAT(variables, clauses) {
    const clauseList = [];
    
    // Generate random clauses
    for (let i = 0; i < clauses; i++) {
      const clause = [];
      const clauseSize = 3; // 3-SAT
      
      // Generate literals for this clause
      for (let j = 0; j < clauseSize; j++) {
        const variable = Math.floor(Math.random() * variables) + 1;
        const isNegated = Math.random() < 0.5;
        clause.push(isNegated ? -variable : variable);
      }
      
      clauseList.push(clause);
    }
    
    return {
      type: 'sat',
      name: `3-SAT Problem (${variables} variables, ${clauses} clauses)`,
      size: variables,
      variables,
      clauses: clauseList,
      dimensions: 11
    };
  }
  
  /**
   * Generate a Subset Sum Problem instance
   * @param {number} size - Number of integers in the set
   * @returns {Object} Subset sum problem instance
   */
  static generateSubsetSum(size) {
    const numbers = [];
    let sum = 0;
    
    // Generate random positive integers
    for (let i = 0; i < size; i++) {
      const num = Math.floor(Math.random() * 1000) + 1;
      numbers.push(num);
      
      // Include in sum with 50% probability
      if (Math.random() < 0.5) {
        sum += num;
      }
    }
    
    return {
      type: 'subset-sum',
      name: `Subset Sum Problem (${size} integers)`,
      size,
      numbers,
      target: sum,
      dimensions: 11
    };
  }
}

// Export the problem generator
if (typeof module !== 'undefined') {
  module.exports = { ProblemGenerator };
}
