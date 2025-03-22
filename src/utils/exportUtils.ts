
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { ProjectInsightsType, InsightMetric, InsightSummary } from '@/services/insightsService';
import { Project } from '@/services/projectService';

// Helper for generating formatted date
const getFormattedDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Prepare metadata and footer
const getMetadata = (project: Project) => {
  return {
    title: project.title,
    generatedAt: getFormattedDate(),
    appName: 'QualAgents',
    version: '1.0.0',
    poweredBy: 'Powered by QualAgents AI'
  };
};

// PDF Export
export const exportAsPdf = async (project: Project, insights: ProjectInsightsType) => {
  const metadata = getMetadata(project);
  
  // Create a temporary div element to render the PDF content
  const container = document.createElement('div');
  container.className = 'pdf-container';
  container.style.padding = '40px';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.fontFamily = 'Arial, sans-serif';
  
  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 style="color: #8B5CF6; margin-bottom: 8px;">${metadata.title}</h1>
    <p style="color: #6B7280; margin-bottom: 24px;">Generated on: ${metadata.generatedAt}</p>
    <hr style="border: 1px solid #E5E7EB; margin-bottom: 24px;" />
  `;
  container.appendChild(header);
  
  // Metrics Section
  if (insights.metrics.length > 0) {
    const metricsSection = document.createElement('div');
    metricsSection.innerHTML = `
      <h2 style="color: #4B5563; margin-bottom: 16px;">Key Metrics</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
        ${insights.metrics.map(metric => `
          <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
            <h3 style="color: #4B5563; margin-bottom: 8px;">${metric.name}</h3>
            <p style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">${metric.value}</p>
            ${metric.change !== undefined ? `
              <p style="color: ${metric.status === 'positive' ? 'green' : metric.status === 'negative' ? 'red' : 'gray'}; font-size: 14px;">
                ${metric.change > 0 ? '+' : ''}${metric.change}%
              </p>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(metricsSection);
  }
  
  // Key Insights Section
  if (insights.topInsights.length > 0) {
    const insightsSection = document.createElement('div');
    insightsSection.innerHTML = `
      <h2 style="color: #4B5563; margin-bottom: 16px;">Key Insights</h2>
      <div style="margin-bottom: 24px;">
        ${insights.topInsights.map(insight => `
          <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <div>
                <span style="font-weight: bold;">${insight.agentName}</span>
                <span style="background-color: #F3F4F6; border-radius: 9999px; padding: 2px 8px; font-size: 12px; margin-left: 8px;">${insight.methodology}</span>
              </div>
              <div style="color: #6B7280; font-size: 12px;">${insight.date}</div>
            </div>
            <p style="margin-bottom: 8px;">${insight.text}</p>
            <p style="color: #6B7280; font-size: 12px;">Relevance: ${insight.relevance}%</p>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(insightsSection);
  }
  
  // Distribution by Category
  if (insights.categories.length > 0) {
    const categoriesSection = document.createElement('div');
    categoriesSection.innerHTML = `
      <h2 style="color: #4B5563; margin-bottom: 16px;">Distribution by Category</h2>
      <div style="margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: left;">Category</th>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">Count</th>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${insights.categories.map(category => {
              const total = insights.categories.reduce((sum, c) => sum + c.count, 0);
              const percentage = (category.count / total * 100).toFixed(2);
              return `
                <tr>
                  <td style="border: 1px solid #E5E7EB; padding: 8px;">${category.name}</td>
                  <td style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">${category.count}</td>
                  <td style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">${percentage}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.appendChild(categoriesSection);
  }
  
  // Trends Section
  if (insights.trends.length > 0) {
    const trendsSection = document.createElement('div');
    trendsSection.innerHTML = `
      <h2 style="color: #4B5563; margin-bottom: 16px;">Trend Analysis</h2>
      <div style="margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: left;">Date</th>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: left;">Category</th>
              <th style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${insights.trends.map(trend => `
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 8px;">${trend.date}</td>
                <td style="border: 1px solid #E5E7EB; padding: 8px;">${trend.category}</td>
                <td style="border: 1px solid #E5E7EB; padding: 8px; text-align: right;">${trend.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.appendChild(trendsSection);
  }
  
  // Footer
  const footer = document.createElement('div');
  footer.style.borderTop = '1px solid #E5E7EB';
  footer.style.marginTop = '24px';
  footer.style.paddingTop = '16px';
  footer.style.color = '#6B7280';
  footer.style.fontSize = '12px';
  footer.style.textAlign = 'center';
  footer.innerHTML = `
    <p>${metadata.appName} v${metadata.version}</p>
    <p>${metadata.poweredBy}</p>
  `;
  container.appendChild(footer);
  
  // Append to DOM temporarily (required for html2pdf to work)
  document.body.appendChild(container);
  
  try {
    // Configure html2pdf options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${project.title.replace(/\s+/g, '_')}_insights.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download PDF
    await html2pdf().set(opt).from(container).save();
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

// Markdown Export
export const exportAsMarkdown = (project: Project, insights: ProjectInsightsType) => {
  const metadata = getMetadata(project);
  let markdown = '';
  
  // Title and metadata
  markdown += `# ${metadata.title}\n\n`;
  markdown += `Generated on: ${metadata.generatedAt}\n\n`;
  markdown += `---\n\n`;
  
  // Metrics
  if (insights.metrics.length > 0) {
    markdown += `## Key Metrics\n\n`;
    insights.metrics.forEach(metric => {
      markdown += `### ${metric.name}\n`;
      markdown += `**${metric.value}**\n`;
      if (metric.change !== undefined) {
        markdown += `*${metric.change > 0 ? '+' : ''}${metric.change}% (${metric.status})*\n`;
      }
      markdown += '\n';
    });
    markdown += '\n';
  }
  
  // Key Insights
  if (insights.topInsights.length > 0) {
    markdown += `## Key Insights\n\n`;
    insights.topInsights.forEach(insight => {
      markdown += `### ${insight.agentName} (${insight.methodology})\n`;
      markdown += `*${insight.date}*\n\n`;
      markdown += `${insight.text}\n\n`;
      markdown += `Relevance: ${insight.relevance}%\n\n`;
      markdown += `---\n\n`;
    });
  }
  
  // Categories
  if (insights.categories.length > 0) {
    markdown += `## Distribution by Category\n\n`;
    markdown += `| Category | Count | Percentage |\n`;
    markdown += `| --- | ---: | ---: |\n`;
    
    const total = insights.categories.reduce((sum, c) => sum + c.count, 0);
    insights.categories.forEach(category => {
      const percentage = (category.count / total * 100).toFixed(2);
      markdown += `| ${category.name} | ${category.count} | ${percentage}% |\n`;
    });
    markdown += '\n';
  }
  
  // Trends
  if (insights.trends.length > 0) {
    markdown += `## Trend Analysis\n\n`;
    markdown += `| Date | Category | Value |\n`;
    markdown += `| --- | --- | ---: |\n`;
    
    insights.trends.forEach(trend => {
      markdown += `| ${trend.date} | ${trend.category} | ${trend.value} |\n`;
    });
    markdown += '\n';
  }
  
  // Footer
  markdown += `---\n\n`;
  markdown += `*${metadata.appName} v${metadata.version}*\n\n`;
  markdown += `*${metadata.poweredBy}*\n`;
  
  // Save the markdown file
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${project.title.replace(/\s+/g, '_')}_insights.md`);
  
  return true;
};

// CSV Export
export const exportAsCsv = (project: Project, insights: ProjectInsightsType) => {
  const metadata = getMetadata(project);
  
  // Prepare headers
  let csv = 'Agent Type,Agent Name,Methodology,Insight,Relevance,Generated At\n';
  
  // Add insights data
  insights.topInsights.forEach(insight => {
    // Escape any commas within fields
    const agentType = 'Research Agent';
    const agentName = insight.agentName.replace(/,/g, ';');
    const methodology = insight.methodology.replace(/,/g, ';');
    const insightText = insight.text.replace(/,/g, ';').replace(/\n/g, ' ');
    const relevance = insight.relevance;
    const date = insight.date;
    
    csv += `${agentType},${agentName},${methodology},"${insightText}",${relevance},${date}\n`;
  });
  
  // Save the CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${project.title.replace(/\s+/g, '_')}_insights.csv`);
  
  return true;
};

// JSON Export
export const exportAsJson = (project: Project, insights: ProjectInsightsType) => {
  const metadata = getMetadata(project);
  
  // Create a structured JSON object
  const exportData = {
    metadata: {
      projectTitle: project.title,
      generatedAt: metadata.generatedAt,
      appName: metadata.appName,
      version: metadata.version,
      poweredBy: metadata.poweredBy
    },
    projectInfo: {
      id: project.id,
      title: project.title,
      description: project.description,
      date: project.date,
      status: project.status,
      methodologies: project.methodologies
    },
    insights: {
      metrics: insights.metrics,
      topInsights: insights.topInsights,
      categories: insights.categories,
      trends: insights.trends,
      thematicClusters: insights.thematicClusters
    }
  };
  
  // Save the JSON file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${project.title.replace(/\s+/g, '_')}_insights.json`);
  
  return true;
};
