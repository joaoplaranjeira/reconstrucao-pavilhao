// Modal functionality
const modal = document.getElementById('supportModal');
const btn = document.getElementById('openModal');
const span = document.getElementsByClassName('close')[0];

// Open modal
btn.onclick = function(e) {
  e.preventDefault();
  modal.style.display = 'block';
}

// Close modal when clicking X
span.onclick = function() {
  modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Handle form submission
const form = document.getElementById('supportForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Send via Formspree (you'll need to replace with your Formspree endpoint)
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      alert('Obrigado! A sua mensagem foi enviada com sucesso.');
      modal.style.display = 'none';
      form.reset();
    } else {
      alert('Ocorreu um erro. Por favor, tente novamente.');
    }
  }).catch(error => {
    alert('Ocorreu um erro. Por favor, tente novamente.');
  });
});

// Progress bar functionality
function updateProgressBar(progressFill, percentage) {
  progressFill.style.width = percentage + '%';
  
  // Update task percentage if this is a task progress bar
  const taskProgress = progressFill.closest('.task-progress');
  if (taskProgress) {
    const percentageText = taskProgress.querySelector('.task-percentage');
    if (percentageText) {
      percentageText.textContent = percentage + '%';
    }
  }
  
  // Update year percentage if this is a year progress bar
  const container = progressFill.closest('.progress-container');
  if (container && container.classList.contains('year-progress')) {
    const percentageText = container.querySelector('.progress-percentage');
    if (percentageText) {
      percentageText.textContent = percentage + '%';
    }
  }
  
  // Update total percentage if this is the total progress bar
  if (container && container.classList.contains('total-progress')) {
    const percentageText = container.querySelector('.progress-percentage');
    if (percentageText) {
      percentageText.textContent = percentage + '%';
    }
  }
}

// Calculate year progress based on task progress
function updateYearProgress(yearElement) {
  const taskBars = yearElement.querySelectorAll('.task-item .progress-fill');
  let totalProgress = 0;
  taskBars.forEach(bar => {
    const progress = parseInt(bar.getAttribute('data-progress')) || 0;
    totalProgress += progress;
  });
  const avgProgress = taskBars.length > 0 ? Math.round(totalProgress / taskBars.length) : 0;
  
  const yearProgressBar = yearElement.querySelector('.year-progress .progress-fill');
  if (yearProgressBar) {
    yearProgressBar.setAttribute('data-progress', avgProgress);
    updateProgressBar(yearProgressBar, avgProgress);
  }
  
  // Update total progress after updating year
  updateTotalProgress();
}

// Calculate total progress based on all tasks
function updateTotalProgress() {
  const allTaskBars = document.querySelectorAll('.task-item .progress-fill');
  let totalProgress = 0;
  allTaskBars.forEach(bar => {
    const progress = parseInt(bar.getAttribute('data-progress')) || 0;
    totalProgress += progress;
  });
  const avgProgress = allTaskBars.length > 0 ? Math.round(totalProgress / allTaskBars.length) : 0;
  
  const totalProgressBar = document.getElementById('totalProgressBar');
  if (totalProgressBar) {
    totalProgressBar.setAttribute('data-progress', avgProgress);
    updateProgressBar(totalProgressBar, avgProgress);
  }
}

// Load and apply progress values from data attributes
document.addEventListener('DOMContentLoaded', function() {
  const progressBars = document.querySelectorAll('.progress-fill');
  progressBars.forEach(bar => {
    const progress = parseInt(bar.getAttribute('data-progress')) || 0;
    setTimeout(() => {
      updateProgressBar(bar, progress);
    }, 300);
  });
  
  // Calculate initial year and total progress from HTML values
  setTimeout(() => {
    const years = document.querySelectorAll('.ano');
    years.forEach(yearElement => {
      updateYearProgress(yearElement);
    });
  }, 400);
});

// Update task progress - Example: updateTaskProgress(0, 0, 50) - Year 2025, Task 1, 50%
function updateTaskProgress(yearIndex, taskIndex, percentage) {
  const years = document.querySelectorAll('.ano');
  if (yearIndex >= 0 && yearIndex < years.length) {
    const yearElement = years[yearIndex];
    const taskBars = yearElement.querySelectorAll('.task-item .progress-fill');
    
    if (taskIndex >= 0 && taskIndex < taskBars.length) {
      const bar = taskBars[taskIndex];
      bar.setAttribute('data-progress', percentage);
      updateProgressBar(bar, percentage);
      
      // Save to localStorage
      localStorage.setItem(`year-${yearIndex}-task-${taskIndex}`, percentage);
      
      // Update year progress
      updateYearProgress(yearElement);
    }
  }
}

// Load saved progress from localStorage
window.addEventListener('load', function() {
  const years = document.querySelectorAll('.ano');
  let hasLocalStorageData = false;
  
  years.forEach((yearElement, yearIndex) => {
    const taskBars = yearElement.querySelectorAll('.task-item .progress-fill');
    taskBars.forEach((bar, taskIndex) => {
      const savedProgress = localStorage.getItem(`year-${yearIndex}-task-${taskIndex}`);
      if (savedProgress !== null) {
        hasLocalStorageData = true;
        bar.setAttribute('data-progress', savedProgress);
        updateProgressBar(bar, parseInt(savedProgress));
      }
    });
    // Update year progress after loading all tasks
    updateYearProgress(yearElement);
  });
  
  // Update total progress after loading all data
  updateTotalProgress();
});
