import os
from flask import Flask, render_template, request, jsonify, Response, session
from algorithm import quiz_state, calculate_similarity

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Required for session

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/amsterdam')
def amsterdam():
    return render_template('amsterdam.html')

@app.route('/tool', methods=['GET', 'POST'])
def tool():
    if request.method == 'POST':
        try:
            # Get form data
            user_input = {
                'size': request.form.get('size'),
                'density': request.form.get('density'),
                'public_transport': request.form.get('public_transport'),
                'cycling_infrastructure': request.form.get('cycling_infrastructure'),
                'street_layout': request.form.get('street_layout'),
                'tourism': request.form.get('tourism'),
                'car_ownership': request.form.get('car_ownership'),
                'traffic_congestion': request.form.get('traffic_congestion')
            }
            
            # Calculate similarities and store in session
            result = calculate_similarity(user_input)
            session['city_scores'] = result['all_scores']
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Initialize quiz state for GET requests
    quiz_state.reset()
    return render_template('tool.html')

@app.route("/quiz/next", methods=["POST"])
def next_question():
    state = quiz_state.next_question()
    return jsonify(state)

@app.route("/quiz/prev", methods=["POST"])
def prev_question():
    state = quiz_state.prev_question()
    return jsonify(state)

@app.route('/quiz/progress')
def get_progress():
    return jsonify(quiz_state.get_progress())

@app.route('/quiz/reset', methods=['POST'])
def reset_quiz():
    quiz_state.reset()
    return jsonify(quiz_state.get_progress())

@app.route('/result')
def result():
    return render_template('result1.html')

@app.route('/result_amsterdam')
def result_amsterdam():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'amsterdam':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_amsterdam.html', accuracy=accuracy, city_name='amsterdam')

@app.route('/result_oslo')
def result_oslo():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'oslo':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_oslo.html', accuracy=accuracy, city_name='oslo')

@app.route('/result_munich')
def result_munich():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'munich':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_munich.html', accuracy=accuracy, city_name='munich')

@app.route('/result_madrid')
def result_madrid():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'madrid':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_madrid.html', accuracy=accuracy, city_name='madrid')

@app.route('/result_ghent')
def result_ghent():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'ghent':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_ghent.html', accuracy=accuracy, city_name='ghent')

@app.route('/result_copenhagen')
def result_copenhagen():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'copenhagen':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_copenhagen.html', accuracy=accuracy, city_name='copenhagen')

@app.route('/result_paris')
def result_paris():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'paris':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_paris.html', accuracy=accuracy, city_name='paris')

@app.route('/result_brussels')
def result_brussels():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'brussels':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_brussels.html', accuracy=accuracy, city_name='brussels')

@app.route('/result_zurich')
def result_zurich():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'zurich':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_zurich.html', accuracy=accuracy, city_name='zurich')

@app.route('/result_bilbao')
def result_bilbao():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'bilbao':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_bilbao.html', accuracy=accuracy, city_name='bilbao')

@app.route('/result_helsinki')
def result_helsinki():
    accuracy = request.args.get('accuracy')
    if not accuracy and 'city_scores' in session:
        for score in session['city_scores']:
            if score['city'].lower() == 'helsinki':
                accuracy = str(int(score['similarity'] * 100))
                break
    return render_template('result_helsinki.html', accuracy=accuracy, city_name='helsinki')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # default to 5000 if not set
    app.run(host="0.0.0.0", port=port)