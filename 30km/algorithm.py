import json
from flask import request, jsonify

# Quiz state management
class QuizState:
    def __init__(self):
        self.reset()

    def reset(self):
        self.current_question = 0
        self.total_questions = 8
        self.has_started = False
        self.questions = [
            "What is the current population of your city?",
            "What is the population density?",
            "Rate the quality of public transport",
            "Rate the quality of cycling infrastructure",
            "Describe the predominant street layout",
            "Approximately how many tourists visit your city annually?",
            "What is the level of car ownership in your city?",
            "What is the average daily time lost to traffic congestion in your city?"
        ]

    def next_question(self):
        if self.current_question < self.total_questions - 1:
            self.current_question += 1
            self.has_started = True
            return self.get_state()
        return self.get_state()

    def prev_question(self):
        if self.current_question > 0:
            self.current_question -= 1
            return self.get_state()
        return self.get_state()

    def get_state(self):
        # Calculate progress
        if not self.has_started:
            progress = 0
        else:
            if self.current_question == 0:
                progress = 0
            elif self.current_question == self.total_questions - 1:
                progress = 100
            else:
                # Calculate progress to next step
                step_size = 100 / (self.total_questions - 1)
                progress = self.current_question * step_size

        return {
            'current_question': self.current_question + 1,
            'total_questions': self.total_questions,
            'question_text': self.questions[self.current_question],
            'progress': progress,
            'has_started': self.has_started
        }

    def get_progress(self):
        return self.get_state()

# Create a quiz state instance
quiz_state = QuizState()

# City data for matching
city_data = [
    {
      "city": "Amsterdam",
      "size": "Medium",
      "density": "Very High",
      "public_transport": "Very High",
      "cycling_infrastructure": "Cycling-first",
      "street_layout": "Narrow Historic",
      "tourism": "Very High",
      "car_ownership": "Low",
      "traffic_congestion": "High"
    },
    {
      "city": "Munich",
      "size": "Large",
      "density": "High",
      "public_transport": "High",
      "cycling_infrastructure": "Extensive",
      "street_layout": "Mixed-width",
      "tourism": "High",
      "car_ownership": "High",
      "traffic_congestion": "High"
    },
    {
      "city": "Ghent",
      "size": "Small",
      "density": "Medium",
      "public_transport": "Medium",
      "cycling_infrastructure": "Cycling-first",
      "street_layout": "Narrow Historic",
      "tourism": "Medium",
      "car_ownership": "Medium",
      "traffic_congestion": "Medium"
    },
    {
      "city": "Copenhagen",
      "size": "Medium",
      "density": "Medium",
      "public_transport": "Very High",
      "cycling_infrastructure": "Cycling-first",
      "street_layout": "Mixed-width",
      "tourism": "High",
      "car_ownership": "Low",
      "traffic_congestion": "High"
    },
    {
      "city": "Paris",
      "size": "Metropolitan",
      "density": "Very High",
      "public_transport": "Very High",
      "cycling_infrastructure": "Extensive",
      "street_layout": "Highly Mixed Fabric",
      "tourism": "Very High",
      "car_ownership": "Low",
      "traffic_congestion": "Severe"
    },
    {
      "city": "Brussels",
      "size": "Large",
      "density": "Medium",
      "public_transport": "High",
      "cycling_infrastructure": "Developing",
      "street_layout": "Highly Mixed Fabric",
      "tourism": " Very High",
      "car_ownership": "Medium",
      "traffic_congestion": "Severe"
    },
    {
      "city": "Zurich",
      "size": "Medium",
      "density": "High",
      "public_transport": "Very High",
      "cycling_infrastructure": "Extensive",
      "street_layout": "Mixed-width",
      "tourism": "Medium",
      "car_ownership": "Low",
      "traffic_congestion": "Medium"
    },
    {
      "city": "Bilbao",
      "size": "Small",
      "density": "High",
      "public_transport": "Medium",
      "cycling_infrastructure": "Minimal",
      "street_layout": "Narrow Historic",
      "tourism": "Medium",
      "car_ownership": "Medium",
      "traffic_congestion": "Medium"
    },
    {
      "city": "Helsinki",
      "size": "Medium",
      "density": "Medium",
      "public_transport": "High",
      "cycling_infrastructure": "Extensive",
      "street_layout": "Mixed-width",
      "tourism": "Medium",
      "car_ownership": "Medium",
      "traffic_congestion": "High"
    },
    {
      "city": "Oslo",
      "size": "Medium",
      "density": "Medium",
      "public_transport": "High",
      "cycling_infrastructure": "Developing",
      "street_layout": "Mixed-width",
      "tourism": "Medium",
      "car_ownership": "Medium",
      "traffic_congestion": "Medium"
    },
    {
      "city": "Madrid",
      "size": "Metropolitan",
      "density": "Very High",
      "public_transport": "Very High",
      "cycling_infrastructure": "Minimal",
      "street_layout": "Highly Mixed Fabric",
      "tourism": "Very High",
      "car_ownership": "Medium",
      "traffic_congestion": "High"
    }
  ]

def normalize(value):
    """Normalize input values for comparison"""
    if not value:
        return ""
    # Convert to lowercase and remove extra spaces
    return str(value).lower().strip()

def calculate_similarity(user_input):
    """Calculate similarity between user input and city data"""
    # Calculate similarity for each city
    city_scores = []
    for city in city_data:
        matches = 0
        total_attributes = 0
        
        # Count exact matches
        for key in user_input:
            if key in city:
                total_attributes += 1
                user_val = normalize(user_input[key])
                city_val = normalize(city[key])
                match = user_val == city_val
                if match:
                    matches += 1
        
        # Calculate similarity as percentage of matches
        similarity = matches / total_attributes if total_attributes > 0 else 0
        
        city_scores.append({
            'city': city['city'],
            'similarity': similarity
        })
    
    # Sort by similarity score
    city_scores.sort(key=lambda x: x['similarity'], reverse=True)
    best_match = city_scores[0]
    
    # Return the result in the format expected by the frontend
    return {
        'city': best_match['city'],
        'similarity': best_match['similarity'],
        'all_scores': city_scores
    }
