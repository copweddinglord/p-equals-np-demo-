/**
 * Visualization functions for NP problem solutions
 */

function visualizeSolution(canvas, problem, result) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  switch (problem.type) {
    case 'tsp':
      visualizeTSP(ctx, problem, result);
      break;
    case 'graph-coloring':
      visualizeGraphColoring(ctx, problem, result);
      break;
    case 'sat':
      visualizeSAT(ctx, problem, result);
      break;
    case 'subset-sum':
      visualizeSubsetSum(ctx, problem, result);
      break;
  }
}

function visualizeTSP(ctx, problem, result) {
  const { cities } = problem;
  const { path } = result.solution;
  
  // Find bounds
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const city of cities) {
    minX = Math.min(minX, city.x);
    minY = Math.min(minY, city.y);
    maxX = Math.max(maxX, city.x);
    maxY = Math.max(maxY, city.y);
  }
  
  // Add padding
  const padding = 30;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;
  
  // Scale factors
  const scaleX = canvas.width / (maxX - minX);
  const scaleY = canvas.height / (maxY - minY);
  
  // Draw path
  ctx.beginPath();
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  
  for (let i = 0; i < path.length; i++) {
    const cityIndex = path[i];
    const city = cities[cityIndex];
    const x = (city.x - minX) * scaleX;
    const y = (city.y - minY) * scaleY;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Close the loop
  const firstCityIndex = path[0];
  const firstCity = cities[firstCityIndex];
  ctx.lineTo((firstCity.x - minX) * scaleX, (firstCity.y - minY) * scaleY);
  
  ctx.stroke();
  
  // Draw cities
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const x = (city.x - minX) * scaleX;
    const y = (city.y - minY) * scaleY;
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2196F3';
    ctx.fill();
    
    // Draw city index
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(i.toString(), x + 8, y + 8);
  }
  
  // Draw legend
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.fillText(`Total Distance: ${result.solution.distance.toFixed(2)}`, 10, 20);
  ctx.fillText(`Solution Time: ${result.timeElapsed.toFixed(2)} ms`, 10, 40);
}

function visualizeGraphColoring(ctx, problem, result) {
  const { graph } = problem;
  const { coloring } = result.solution;
  const n = graph.length;
  
  // Calculate node positions in a circle
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;
  const nodePositions = [];
  
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    nodePositions.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  
  // Draw edges
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (graph[i][j] === 1) {
        ctx.beginPath();
        ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
        ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Define colors for nodes
  const colors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
    '#ff7f00', '#ffff33', '#a65628', '#f781bf',
    '#999999', '#66c2a5', '#fc8d62', '#8da0cb'
  ];
  
  // Draw nodes
  const nodeRadius = 15;
  
  for (let i = 0; i < n; i++) {
    const pos = nodePositions[i];
    const color = colors[coloring[i] % colors.length];
    
    // Draw node
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw node index
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i.toString(), pos.x, pos.y);
  }
  
  // Draw legend
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Colors Used: ${result.solution.colorCount}`, 10, 20);
  ctx.fillText(`Solution Time: ${result.timeElapsed.toFixed(2)} ms`, 10, 40);
}

function visualizeSAT(ctx, problem, result) {
  const { variables, clauses } = problem;
  const { assignment, satisfied } = result.solution;
  
  // Draw title
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`3-SAT Problem with ${variables} variables and ${clauses.length} clauses`, canvas.width / 2, 30);
  
  // Draw satisfaction status
  ctx.font = '20px Arial';
  ctx.fillStyle = satisfied ? '#4CAF50' : '#F44336';
  ctx.fillText(satisfied ? 'SATISFIED ✓' : 'UNSATISFIED ✗', canvas.width / 2, 60);
  
  // Draw variable assignments
  const cellWidth = 30;
  const cellHeight = 30;
  const startX = (canvas.width - variables * cellWidth) / 2;
  const startY = 100;
  
  // Draw header
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Variable Assignments:', canvas.width / 2, 90);
  
  // Draw variable cells
  for (let i = 0; i < variables; i++) {
    const x = startX + i * cellWidth;
    
    // Draw variable number
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`x${i+1}`, x + cellWidth / 2, startY - 5);
    
    // Draw cell
    ctx.fillStyle = assignment[i] ? '#4CAF50' : '#F44336';
    ctx.fillRect(x, startY, cellWidth, cellHeight);
    
    // Draw value
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(assignment[i] ? 'T' : 'F', x + cellWidth / 2, startY + cellHeight / 2);
  }
  
  // Draw clauses
  const clauseStartY = startY + cellHeight + 30;
  const clauseHeight = 25;
  
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Clauses:', canvas.width / 2, clauseStartY - 10);
  
  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i];
    const y = clauseStartY + i * clauseHeight;
    
    // Check if clause is satisfied
    let clauseSatisfied = false;
    for (const literal of clause) {
      const variable = Math.abs(literal) - 1;
      const isPositive = literal > 0;
      if (assignment[variable] === isPositive) {
        clauseSatisfied = true;
        break;
      }
    }
    
    // Draw clause box
    ctx.fillStyle = clauseSatisfied ? '#E8F5E9' : '#FFEBEE';
    ctx.fillRect(startX, y, variables * cellWidth, clauseHeight);
    
    // Draw clause text
    let clauseText = '(';
    for (let j = 0; j < clause.length; j++) {
      const literal = clause[j];
      const variable = Math.abs(literal) - 1;
      const isPositive = literal > 0;
      
      clauseText += (isPositive ? '' : '¬') + `x${variable+1}`;
      
      if (j < clause.length - 1) {
        clauseText += ' ∨ ';
      }
    }
    clauseText += ')';
    
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(clauseText, canvas.width / 2, y + clauseHeight / 2);
  }
  
  // Draw solution info
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Solution Time: ${result.timeElapsed.toFixed(2)} ms`, 10, canvas.height - 30);
}

function visualizeSubsetSum(ctx, problem, result) {
  const { numbers, target } = problem;
  const { subset, sum } = result.solution;
  
  // Draw title
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Subset Sum Problem with ${numbers.length} numbers, target: ${target}`, canvas.width / 2, 30);
  
  // Draw result
  ctx.font = '20px Arial';
  ctx.fillStyle = Math.abs(sum - target) < 0.001 * target ? '#4CAF50' : '#F44336';
  ctx.fillText(`Sum: ${sum} (Target: ${target})`, canvas.width / 2, 60);
  
  // Draw numbers
  const cellWidth = Math.min(60, (canvas.width - 40) / numbers.length);
  const cellHeight = 40;
  const startX = (canvas.width - numbers.length * cellWidth) / 2;
  const startY = 100;
  
  // Draw header
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Numbers (selected in green):', canvas.width / 2, 90);
  
  // Draw number cells
  for (let i = 0; i < numbers.length; i++) {
    const x = startX + i * cellWidth;
    const isSelected = subset.includes(i);
    
    // Draw cell
    ctx.fillStyle = isSelected ? '#4CAF50' : '#F5F5F5';
    ctx.fillRect(x, startY, cellWidth, cellHeight);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, startY, cellWidth, cellHeight);
    
    // Draw number
    ctx.fillStyle = isSelected ? 'white' : 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(numbers[i].toString(), x + cellWidth / 2, startY + cellHeight / 2);
  }
  
  // Draw equation
  let equation = '';
  for (let i = 0; i < subset.length; i++) {
    equation += numbers[subset[i]];
    if (i < subset.length - 1) {
      equation += ' + ';
    }
  }
  equation += ' = ' + sum;
  
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(equation, canvas.width / 2, startY + cellHeight + 40);
  
  // Draw solution info
  ctx.fillStyle = 'black';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Solution Time: ${result.timeElapsed.toFixed(2)} ms`, 10, canvas.height - 30);
}

// Export visualization functions
if (typeof module !== 'undefined') {
  module.exports = { 
    visualizeSolution,
    visualizeTSP,
    visualizeGraphColoring,
    visualizeSAT,
    visualizeSubsetSum
  };
}
