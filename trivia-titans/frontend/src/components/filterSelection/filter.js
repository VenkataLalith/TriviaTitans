import React from 'react';
import './filter.css';

const FilterSection = ({ title, options, selectedOption, onOptionChange }) => {
	return (
		<div className="filter-section-container">
			<p className="filter-section-title">{title}</p>
			<div className="filter-buttons-container">
				{options.map((option) => (
					<React.Fragment key={option}>
						<input
							type="radio"
							id={option}
							value={option}
							checked={selectedOption === option}
							onChange={() => onOptionChange(option)}
						/>
						<label htmlFor={option}>{option}</label>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default FilterSection;
