// sports-chart.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQt8FlMyY_A2jfJsZiIWgx2ZgXBeWeuPLndoHxrspjqBgM9IP9R6XNAykgVzpn_GQtrb0d49v51ldNM/pub?output=csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process CSV data
            const rows = data.split('\n').filter(row => row.trim() !== '');
            const header = rows[0].split(',');
            const labels = [];
            const values = [];

            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(',');
                if (cols.length >= 2) {
                    const sport = cols[0].trim();
                    const fans = parseFloat(cols[1].trim());
                    
                    if (sport && !isNaN(fans)) {
                        labels.push(sport);
                        values.push(fans);
                    }
                }
            }

            renderFamousSportsChart(labels, values);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            // Fallback data in case of fetch failure
            const fallbackLabels = ['Football', 'Cricket', 'Basketball', 'Field Hockey', 'Tennis', 'Volleyball', 'Table Tennis', 'Baseball', 'Rugby', 'Golf'];
            const fallbackData = [4, 2.5, 2.2, 2, 1, 0.9, 0.85, 0.5, 0.475, 0.45];
            renderFamousSportsChart(fallbackLabels, fallbackData);
        });

    function renderFamousSportsChart(labels, data) {
        const ctx = document.getElementById('famousSportsChart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.famousSportsChartInstance) {
            window.famousSportsChartInstance.destroy();
        }
        
        window.famousSportsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Fans (in Billions)',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Fans (in Billions)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1);
                            },
                            stepSize: 1
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sports'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toFixed(2) + ' billion fans';
                            }
                        }
                    }
                }
            }
        });
    }
});