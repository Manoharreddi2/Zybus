import React from 'react';

const cities = [
    "Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
    "Ahmedabad", "Jaipur", "Indore", "Bhopal", "Nagpur", "Surat", "Vadodara",
    "Rajkot", "Udaipur", "Kochi", "Trivandrum", "Coimbatore", "Madurai"
];

const CitySelector = ({ label, value, onChange, exclude }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: '0.8rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid #333',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                <option value="">Select City</option>
                {cities.map(city => (
                    <option key={city} value={city} disabled={city === exclude}>
                        {city}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CitySelector;
